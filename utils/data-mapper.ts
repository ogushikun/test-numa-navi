import { RecommendationTag, MediaType } from '../types';

interface AniListMedia {
    genres: string[];
    tags: { name: string; rank: number }[];
    averageScore: number;
    isAdult: boolean;
    episodes?: number;
    chapters?: number;
}

export function mapAniListToNumaTags(media: AniListMedia): RecommendationTag {
    const genres = media.genres || [];
    const tags = (media.tags || []).map(t => t.name);
    const score = media.averageScore || 0;

    // 1. Depth
    let depth = 1; // Default: Otaku
    const deepTags = ["Psychological", "Avant-Garde", "Philosophy", "Surreal", "Seinen", "Josei"];
    const lightGenres = ["Comedy", "Slice of Life"];

    if (deepTags.some(t => tags.includes(t) || genres.includes(t)) || score > 85) {
        depth = 2;
    } else if (lightGenres.some(g => genres.includes(g)) && !deepTags.some(t => tags.includes(t))) {
        depth = 0;
    }

    // 2. Intensity (0: G, 1: R15, 2: R18)
    let intensity = 0;
    const r18Tags = ["Gore", "BDSM", "Nudity", "Sexual Content"];
    const r15Genres = ["Horror", "Psychological", "Thriller", "Ecchi"];
    const r15Tags = ["Violence", "Crime"];

    if (media.isAdult || r18Tags.some(t => tags.includes(t))) {
        intensity = 2; // R18
    } else if (
        r15Genres.some(g => genres.includes(g)) ||
        r15Tags.some(t => tags.includes(t)) ||
        (genres.includes("Action") && (genres.includes("Supernatural") || genres.includes("Mystery")))
    ) {
        intensity = 1; // R15
    }

    // 2.5 Commitment (0: Short, 1: Mid, 2: Long)
    let commitment = 1;
    const episodes = media.episodes || 0;
    const chapters = media.chapters || 0;

    if ((episodes > 0 && episodes <= 13) || (chapters > 0 && chapters <= 20)) {
        commitment = 0;
    } else if (episodes >= 50 || chapters >= 100) {
        commitment = 2;
    }

    // 3. Direction
    let direction: 'story' | 'energy' | 'relation' = 'story';
    const energyGenres = ["Action", "Adventure", "Sports", "Mecha"];
    const relationGenres = ["Romance", "Drama", "Slice of Life", "Shoujo Ai", "Shounen Ai"];

    if (energyGenres.some(g => genres.includes(g))) {
        direction = 'energy';
    } else if (relationGenres.some(g => genres.includes(g))) {
        direction = 'relation';
    }

    // 4. Aftertaste
    let aftertaste: 'refresh' | 'lingering' | 'dark' = 'lingering';
    const darkGenres = ["Horror", "Psychological", "Tragedy", "Thriller"];
    const refreshGenres = ["Comedy", "Sports", "Music"];

    if (darkGenres.some(g => genres.includes(g)) || tags.includes("Suicide") || tags.includes("Gore")) {
        aftertaste = 'dark';
    } else if (refreshGenres.some(g => genres.includes(g)) && !genres.includes("Action") && !genres.includes("Mystery")) {
        // Only "refreshing" if it's NOT action/mystery heavy
        aftertaste = 'refresh';
    }

    // 5. Filter
    let filter: 'avoid' | 'neutral' | 'welcome' = 'neutral';
    const nicheTags = ["Gore", "Incest", "Nudity", "Sexual Content"];

    if (nicheTags.some(t => tags.includes(t))) {
        filter = 'welcome';
    } else if (score > 80 && !nicheTags.some(t => tags.includes(t))) {
        filter = 'avoid'; // "Safe" but high quality? Actually let's keep neutral for most
    }

    return { depth, intensity, commitment, direction, aftertaste, filter };
}
