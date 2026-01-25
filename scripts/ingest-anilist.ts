import * as dotenv from 'dotenv';
import path from 'path';

// Force load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ANILIST_API_URL = 'https://graphql.anilist.co';

const QUERY = `
query ($page: Int, $perPage: Int, $type: MediaType, $format_in: [MediaFormat], $startDate_greater: FuzzyDateInt, $startDate_lesser: FuzzyDateInt) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (type: $type, format_in: $format_in, startDate_greater: $startDate_greater, startDate_lesser: $startDate_lesser, sort: POPULARITY_DESC, isAdult: false) {
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
      bannerImage
      coverImage {
        large
      }
      averageScore
      isAdult
      countryOfOrigin
      externalLinks {
        url
        site
      }
    }
  }
}
`;

interface BatchConfig {
  label: string;
  type: 'ANIME' | 'MANGA';
  formats?: string[]; // e.g. ['TV', 'MOVIE'] or ['NOVEL']
  startYear?: number;
  endYear?: number;
  targetCount: number;
}

async function fetchBatch(config: BatchConfig, mapTagsFn: any, supabase: any) {
  console.log(`\n--- Starting Batch: ${config.label} (Target: ${config.targetCount}) ---`);

  let currentPage = 1;
  let ingestedCount = 0;
  let hasNextPage = true;

  // Convert check: startYear 2000 -> 20000000
  const startDateGreater = config.startYear ? config.startYear * 10000 : undefined;
  const startDateLesser = config.endYear ? (config.endYear * 10000) + 1231 : undefined;

  while (ingestedCount < config.targetCount && hasNextPage) {
    console.log(`Fetching page ${currentPage}... (Ingested: ${ingestedCount}/${config.targetCount})`);

    try {
      const response = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: QUERY,
          variables: {
            page: currentPage,
            perPage: 50,
            type: config.type,
            format_in: config.formats,
            startDate_greater: startDateGreater,
            startDate_lesser: startDateLesser
          }
        })
      });

      const json = await response.json();
      if (!json.data?.Page) {
        console.warn('No data returned or error:', JSON.stringify(json.errors));
        break;
      }

      const mediaList = json.data.Page.media || [];
      hasNextPage = json.data.Page.pageInfo.hasNextPage;

      for (const item of mediaList) {
        if (ingestedCount >= config.targetCount) break;

        // Origin Check
        if (item.countryOfOrigin !== 'JP') continue;

        const titleNative = item.title.native;
        const titleEnglish = item.title.english || item.title.romaji;
        const displayTitle = titleNative || titleEnglish;

        // Define media type for DB
        // If config format is NOVEL, map to lightnovel. Else map based on type.
        let mediaType = 'anime';
        if (config.type === 'MANGA') {
          if (config.formats?.includes('NOVEL')) {
            mediaType = 'lightnovel';
          } else {
            mediaType = 'manga';
          }
        }

        const mappedTags = mapTagsFn(item);

        // Filter tags
        const highRankTags = (item.tags || [])
          .filter((t: any) => t.rank >= 80)
          .map((t: any) => t.name);

        const combinedGenres = Array.from(new Set([...(item.genres || []), ...highRankTags]));

        const weightedGenres = (item.tags || []).map((t: any) => ({
          name: t.name,
          value: t.rank
        }));

        const { data: insertedWork, error } = await supabase
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
            reason: `AniList High Scored: ${combinedGenres[0]}`,
            depth: mappedTags.depth,
            intensity: mappedTags.intensity,
            direction: mappedTags.direction,
            aftertaste: mappedTags.aftertaste,
            filter: mappedTags.filter,
            genres: combinedGenres,
            weighted_genres: weightedGenres
          }, { onConflict: 'external_id' })
          .select()
          .single();

        if (error) {
          console.error(`Error inserting ${displayTitle}:`, error.message);
        } else if (insertedWork) {
          const urlType = mediaType === 'lightnovel' ? 'manga' : mediaType;
          const links = [
            { work_id: insertedWork.id, label: 'AniList', url: `https://anilist.co/${urlType}/${item.id}` },
            { work_id: insertedWork.id, label: 'Amazon', url: `https://www.amazon.co.jp/s?k=${encodeURIComponent(displayTitle)}&tag=numanavi-22` }
          ];
          await supabase.from('work_links').delete().eq('work_id', insertedWork.id);
          await supabase.from('work_links').insert(links);

          ingestedCount++;
        }
      }

      currentPage++;
      // Safety break
      if (currentPage > 100) break;

    } catch (e) {
      console.error('Batch error:', e);
      break;
    }
  }
}

async function ingest() {
  const { supabase } = await import('../lib/supabase');
  const { mapAniListToNumaTags } = await import('../utils/data-mapper');

  // Define Batches
  const batches: BatchConfig[] = [
    // Anime
    { label: 'Anime 2000s', type: 'ANIME', startYear: 2000, endYear: 2009, targetCount: 200 },
    { label: 'Anime 2010s', type: 'ANIME', startYear: 2010, endYear: 2019, targetCount: 100 },
    { label: 'Anime 2020s', type: 'ANIME', startYear: 2020, endYear: 2029, targetCount: 100 },

    // Manga (No year restriction specified -> Popular of all time)
    { label: 'Manga All-Time', type: 'MANGA', formats: ['MANGA', 'ONE_SHOT'], targetCount: 200 },

    // Light Novel
    { label: 'LN 2000s', type: 'MANGA', formats: ['NOVEL'], startYear: 2000, endYear: 2009, targetCount: 100 },
    { label: 'LN 2010-2020s', type: 'MANGA', formats: ['NOVEL'], startYear: 2010, endYear: 2029, targetCount: 100 },
  ];

  for (const batch of batches) {
    await fetchBatch(batch, mapAniListToNumaTags, supabase);
  }

  console.log('All batches completed.');
}

ingest().catch(console.error);
