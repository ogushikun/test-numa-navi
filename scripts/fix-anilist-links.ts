
import * as dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixLinks() {
    console.log('Starting AniList link fix...');

    // Fetch all works
    const { data: works, error } = await supabase
        .from('works')
        .select('id, media, external_id');

    if (error || !works) {
        console.error('Error fetching works:', error);
        return;
    }

    console.log(`Found ${works.length} works.`);

    let fixedCount = 0;

    for (const work of works) {
        if (!work.external_id.startsWith('AL-')) continue;

        const anilistId = work.external_id.replace('AL-', '');
        const urlType = work.media === 'lightnovel' ? 'manga' : work.media;

        // Construct correct URL
        const correctUrl = `https://anilist.co/${urlType}/${anilistId}`;

        // Update the link where label is 'AniList' for this work
        const { error: updateError } = await supabase
            .from('work_links')
            .update({ url: correctUrl })
            .eq('work_id', work.id)
            .eq('label', 'AniList');

        if (updateError) {
            console.error(`Failed to update ${work.id}:`, updateError);
        } else {
            fixedCount++;
        }
    }

    console.log(`Fixed links for ${fixedCount} works.`);
}

fixLinks().catch(console.error);
