import * as dotenv from 'dotenv';
import path from 'path';

// Force load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ANILIST_API_URL = 'https://graphql.anilist.co';

const QUERY = `
query ($page: Int, $perPage: Int, $type: MediaType, $startDate_greater: FuzzyDateInt, $startDate_lesser: FuzzyDateInt, $format: MediaFormat) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (type: $type, sort: POPULARITY_DESC, isAdult: false, startDate_greater: $startDate_greater, startDate_lesser: $startDate_lesser, format: $format) {
      id
      title {
        romaji
        english
        native
      }
      type
      format
      genres
      tags {
        name
        rank
      }
      description
      coverImage {
        large
      }
      averageScore
      countryOfOrigin
      externalLinks {
        url
        site
      }
    }
  }
}
`;

async function fetchBatch(type: 'ANIME' | 'MANGA', format?: string, count: number = 200) {
  const results = [];
  let page = 1;
  const perPage = 50;

  while (results.length < count) {
    console.log(`Fetching ${type} ${format || ''} page ${page}...`);
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          page,
          perPage,
          type,
          startDate_greater: 19991231,
          startDate_lesser: 20100101,
          format: format || undefined
        }
      })
    });

    const json = await response.json();
    const media = json.data?.Page?.media;

    if (!media || media.length === 0) break;

    results.push(...media);
    if (!json.data.Page.pageInfo.hasNextPage) break;
    page++;

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results.slice(0, count);
}

async function ingest() {
  const { supabase } = await import('../lib/supabase');
  const { mapAniListToNumaTags } = await import('../utils/data-mapper');

  console.log('--- Starting Localized Data Expansion (2000-2009) ---');

  const anime = await fetchBatch('ANIME', undefined, 200);
  const manga = await fetchBatch('MANGA', 'MANGA', 200);
  const novels = await fetchBatch('MANGA', 'NOVEL', 200);

  const allMedia = [...anime, ...manga, ...novels];
  console.log(`Total items to process: ${allMedia.length}`);

  for (const item of allMedia) {
    const titleNative = item.title.native;
    const titleEnglish = item.title.english || item.title.romaji;
    const displayTitle = titleNative || titleEnglish;

    const mappedTags = mapAniListToNumaTags(item);

    // Filter tags with rank >= 80
    const highRankTags = (item.tags || [])
      .filter((t: any) => t.rank >= 80)
      .map((t: any) => t.name);

    const combinedGenres = Array.from(new Set([...(item.genres || []), ...highRankTags]));

    // Filter for Japanese works only
    if (item.countryOfOrigin !== 'JP') {
      console.log(`Skipping non-JP work: ${displayTitle} (${item.countryOfOrigin})`);
      continue;
    }

    let mediaType = 'anime';
    if (item.type === 'MANGA') {
      mediaType = item.format === 'NOVEL' ? 'lightnovel' : 'manga';
    }

    console.log(`Processing [${mediaType}]: ${displayTitle} (${titleEnglish})`);

    const { data: insertedWork, error: workError } = await supabase
      .from('works')
      .upsert({
        external_id: `AL-${item.id}`,
        title: displayTitle,
        title_en: titleEnglish,
        title_jp: titleNative,
        media: mediaType,
        rating: mappedTags.intensity === 2 ? 'R18' : (mappedTags.intensity === 1 ? 'R15' : 'G'),
        description: item.description?.replace(/<[^>]*>?/gm, '') || '',
        thumbnail_url: item.coverImage.large,
        reason: `2000年代を代表する「${combinedGenres[0] || '名作'}」の一つです。`,
        depth: mappedTags.depth,
        intensity: mappedTags.intensity,
        direction: mappedTags.direction,
        aftertaste: mappedTags.aftertaste,
        filter: mappedTags.filter,
        genres: combinedGenres
      }, { onConflict: 'external_id' })
      .select()
      .single();

    if (workError) {
      console.error(`Error inserting ${displayTitle}:`, workError.message);
      continue;
    }

    if (insertedWork) {
      const links = [
        {
          work_id: insertedWork.id,
          label: 'AniListで詳しく見る',
          url: `https://anilist.co/${item.type.toLowerCase()}/${item.id}`
        },
        {
          work_id: insertedWork.id,
          label: 'Amazonで探す',
          url: `https://www.amazon.co.jp/s?k=${encodeURIComponent(displayTitle)}&tag=numanavi-22`
        }
      ];
      await supabase.from('work_links').delete().eq('work_id', insertedWork.id); // Clean old links
      await supabase.from('work_links').insert(links);
    }
  }

  console.log('--- Localization Ingestion Completed ---');
}

ingest().catch(console.error);
