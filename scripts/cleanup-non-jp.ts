import * as dotenv from 'dotenv';
import path from 'path';

// Force load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ANILIST_API_URL = 'https://graphql.anilist.co';

const QUERY = `
query ($ids: [Int]) {
  Page {
    media (id_in: $ids) {
      id
      title {
        native
        english
      }
      countryOfOrigin
    }
  }
}
`;

async function getFormattedIds(supabase: any) {
    const { data, error } = await supabase
        .from('works')
        .select('id, external_id');

    if (error) throw error;
    return data
        .filter((w: any) => w.external_id.startsWith('AL-'))
        .map((w: any) => ({
            dbId: w.id,
            anilistId: parseInt(w.external_id.split('-')[1])
        }));
}

async function checkAndPurge() {
    const { supabase } = await import('../lib/supabase');

    console.log('Fetching all works from DB...');
    const works = await getFormattedIds(supabase);
    console.log(`Found ${works.length} works in DB.`);

    // Process in chunks of 50
    const chunkSize = 50;
    let deletedCount = 0;

    for (let i = 0; i < works.length; i += chunkSize) {
        const chunk = works.slice(i, i + chunkSize);
        const ids = chunk.map(w => w.anilistId);

        console.log(`Checking chunk ${i / chunkSize + 1}...`);

        try {
            const response = await fetch(ANILIST_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: QUERY,
                    variables: { ids }
                })
            });

            const json = await response.json();
            const mediaList = json.data?.Page?.media || [];

            const nonJpIds = mediaList
                .filter((m: any) => m.countryOfOrigin !== 'JP')
                .map((m: any) => m.id);

            if (nonJpIds.length > 0) {
                console.log('Found non-JP works:', nonJpIds);

                // Find DB IDs to delete
                const idsToDelete = chunk
                    .filter(w => nonJpIds.includes(w.anilistId))
                    .map(w => w.dbId);

                const { error: delError } = await supabase
                    .from('works')
                    .delete()
                    .in('id', idsToDelete);

                if (delError) {
                    console.error('Error deleting:', delError);
                } else {
                    console.log(`Deleted ${idsToDelete.length} non-JP works.`);
                    deletedCount += idsToDelete.length;
                }
            }
        } catch (err) {
            console.error('Error processing chunk:', err);
        }
    }

    console.log(`Cleanup complete. Deleted total ${deletedCount} non-JP works.`);
}

checkAndPurge().catch(console.error);
