
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { count: total, error } = await supabase
        .from('works')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error checking works:', error);
        return;
    }

    console.log(`Total works: ${total}`);

    // Breakdown by media
    const mediaTypes = ['anime', 'manga', 'lightnovel'];
    for (const m of mediaTypes) {
        const { count } = await supabase
            .from('works')
            .select('*', { count: 'exact', head: true })
            .eq('media', m);
        console.log(`- ${m}: ${count}`);
    }

    // Check one item for weighted_genres
    const { data: sample } = await supabase
        .from('works')
        .select('title, weighted_genres')
        .not('weighted_genres', 'is', null)
        .limit(1)
        .single();

    if (sample) {
        console.log(`Sample Work: ${sample.title}`);
        console.log(`Weighted Genres:`, JSON.stringify(sample.weighted_genres, null, 2));
    }
}

checkData();
