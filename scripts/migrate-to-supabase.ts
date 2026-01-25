import { supabase } from '../lib/supabase';
import { SAMPLE_WORKS } from '../lib/sample-works';

async function migrate() {
    console.log('Starting migration...');

    for (const work of SAMPLE_WORKS) {
        console.log(`Migrating: ${work.title}`);

        // 1. Insert work
        const { data: insertedWork, error: workError } = await supabase
            .from('works')
            .upsert({
                external_id: work.id, // Using existing ID as external_id for now
                title: work.title,
                media: work.media,
                rating: work.rating,
                description: work.description,
                thumbnail_url: work.thumbnailUrl,
                reason: work.reason,
                depth: work.tags.depth,
                intensity: work.tags.intensity,
                direction: work.tags.direction,
                aftertaste: work.tags.aftertaste,
                filter: work.tags.filter,
                genres: [] // Sample data doesn't have genres yet
            }, { onConflict: 'external_id' })
            .select()
            .single();

        if (workError) {
            console.error(`Error inserting ${work.title}:`, workError.message);
            continue;
        }

        if (insertedWork) {
            // 2. Insert links
            const linksToInsert = work.links.map(link => ({
                work_id: insertedWork.id,
                label: link.label,
                url: link.url
            }));

            const { error: linksError } = await supabase
                .from('work_links')
                .insert(linksToInsert);

            if (linksError) {
                console.error(`Error inserting links for ${work.title}:`, linksError.message);
            }
        }
    }

    console.log('Migration finished.');
}

migrate();
