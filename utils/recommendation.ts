import { UserAnswers, Work, MediaType, PersonaId } from '@/types';
import { supabase } from '@/lib/supabase';
import { getAIProvider } from '@/lib/ai-agent';
import { generateSemanticProfile } from './semantic-profile';

/**
 * Calculates a basic recommendation score for a single work based on user answers.
 */
export function calculateScore(work: Work, userAnswers: UserAnswers, personaId: PersonaId = 'butler'): number {
    const { answers } = userAnswers;
    const workTags = work.tags;
    let score = 0;

    // 1. Media Type Match
    if (userAnswers.media !== 'any' && work.media === userAnswers.media) {
        score += 15;
    }

    // 3. Depth Match (q1) - light, otaku, deep
    const depthMap: Record<string, number> = { 'light': 0, 'otaku': 1, 'deep': 2 };
    const userDepth = depthMap[answers['q1']] ?? 1;
    const depthDiff = Math.abs(workTags.depth - userDepth);
    score += (2 - depthDiff) * 10;

    // 4. Direction Match (q3) - story, energy, relation
    if (workTags.direction === answers['q3']) {
        score += 15;
    }

    // [New] Weighted Tag Bonus
    // If the work has high-ranking tags relevant to the user's "Direction" or "Depth", boost score.
    const wGenres = work.weighted_genres || [];
    const relevantTags = {
        'story': ['Psychological', 'Mystery', 'Sci-Fi', 'Fantasy'],
        'energy': ['Action', 'Sports', 'Adventure'],
        'relation': ['Romance', 'Drama', 'Slice of Life'],
        'dark': ['Horror', 'Thriller', 'Psychological'],
        'deep': ['Philosophy', 'Avant-Garde']
    };

    // Boost if user's direction choice is supported by a high-ranking tag (>80)
    const directionTarget = answers['q3'];
    if (directionTarget && relevantTags[directionTarget as keyof typeof relevantTags]) {
        const hasStrongTag = wGenres.some(g =>
            relevantTags[directionTarget as keyof typeof relevantTags].includes(g.name) && g.value >= 80
        );
        if (hasStrongTag) score += 10;
    }

    // Boost if user's aftertaste choice is supported by a high-ranking tag
    if (answers['q4'] === 'dark') {
        const isDark = wGenres.some(g => relevantTags['dark'].includes(g.name) && g.value >= 75);
        if (isDark) score += 10;
    }

    // 5. Aftertaste Match (q4) - refresh, lingering, dark
    if (workTags.aftertaste === answers['q4']) {
        score += 10;
    }

    // 6. Commitment Match (q5) - quick, moderate, heavy
    const commitmentMap: Record<string, number> = { 'quick': 0, 'moderate': 1, 'heavy': 2 };
    const userComm = commitmentMap[answers['q5']] ?? 1;
    const commDiff = Math.abs((workTags.commitment ?? 1) - userComm);
    score += (2 - commDiff) * 15;

    // 7. Media Specific Match (q6)
    if (answers['q6']) {
        score += 5;
    }

    // 8. Deep Dive Bonus (q7/q8)
    const genres = work.genres || [];
    if (answers['q7'] === 'realistic' && (genres.includes('Slice of Life') || genres.includes('Drama'))) score += 5;
    if (answers['q7'] === 'unreal' && (genres.includes('Fantasy') || genres.includes('Supernatural') || genres.includes('Sci-Fi'))) score += 5;

    if (answers['q8'] === 'virtue' && (genres.includes('Sports') || genres.includes('Adventure'))) score += 5;
    if (answers['q8'] === 'karma' && (genres.includes('Tragedy') || genres.includes('Psychological'))) score += 5;

    // 9. Persona Specific Adjustment
    // Adjust score based on the chosen persona's preference
    if (personaId === 'buddy') {
        const hGenres = ['Action', 'Sports', 'Adventure'];
        if (genres.some(g => hGenres.includes(g))) score += 10;
        if (workTags.direction === 'energy') score += 10;
    }
    else if (personaId === 'devotee') {
        const rGenres = ['Romance', 'Drama', 'Slice of Life'];
        if (genres.some(g => rGenres.includes(g))) score += 10;
        if (workTags.direction === 'relation') score += 10;
    }
    else if (personaId === 'curator') {
        const dGenres = ['Psychological', 'Mystery', 'Sci-Fi', 'Fantasy'];
        if (genres.some(g => dGenres.includes(g))) score += 5;
        if (workTags.depth > 0) score += 5;
    }

    return score;
}

/**
 * Filters and ranks works using a two-stage approach:
 * 1. Fast filtering & scoring from Supabase.
 * 2. Deep semantic ranking via AI Agent (Gemini/OpenAI).
 */
export async function getRecommendations(userAnswers: UserAnswers, refinementHistory: string[] = [], personaId: PersonaId = 'butler'): Promise<{ works: (Work & { score: number })[]; numaType: string }> {
    const { media, answers } = userAnswers;

    // 1. Candidate Retrieval & Fast Scoring
    const intensityMap: Record<string, number> = { 'safe': 0, 'edgy': 1, 'aggressive': 2 };
    const userIntensity = intensityMap[answers['q2']] ?? 1;

    let query = supabase
        .from('works')
        .select(`
            *,
            work_links (
                label,
                url
            )
        `)
        .lte('intensity', userIntensity);

    if (media !== 'any') {
        query = query.eq('media', media);
    }

    // Fetch more candidates than needed for AI to rank (e.g. 50)
    const { data, error } = await query.limit(150);

    if (error) {
        console.error('Error fetching recommendations:', error);
        return { works: [], numaType: '探索エラー' };
    }

    const works: Work[] = data.map((item: any) => ({
        id: item.id,
        external_id: item.external_id,
        title: item.title,
        title_en: item.title_en,
        title_jp: item.title_jp,
        media: item.media as MediaType,
        rating: item.rating,
        description: item.description,
        thumbnailUrl: item.thumbnail_url,
        links: item.work_links || [],
        tags: {
            depth: item.depth,
            intensity: item.intensity,
            commitment: item.commitment ?? 1,
            direction: item.direction,
            aftertaste: item.aftertaste,
            filter: item.filter,
        },
        reason: item.reason,
        genres: item.genres,
        weighted_genres: item.weighted_genres,
    }));

    // ADJUSTMENT: Process entire history to find the LATEST overrides for parameters
    // We make these overrides DRASTIC to ensure Stage 1 includes new work types.
    const effectiveAnswers = { ...userAnswers };
    refinementHistory.forEach(intent => {
        const lowIntent = intent.toLowerCase();

        // 1. Depth & Vibe Overrides
        if (lowIntent.includes('light') || lowIntent.includes('ライト') || lowIntent.includes('癒やし') || lowIntent.includes('笑って')) {
            effectiveAnswers.answers = {
                ...effectiveAnswers.answers,
                'q1': 'light',
                'q4': 'refresh' // Force refresh aftertaste for light requests
            };
        } else if (lowIntent.includes('deep') || lowIntent.includes('深淵') || lowIntent.includes('奥へ') || lowIntent.includes('哲学')) {
            effectiveAnswers.answers = {
                ...effectiveAnswers.answers,
                'q1': 'deep',
                'q4': 'dark' // Force dark/lingering aftertaste for deep requests
            };
        }

        // 2. Intensity Overrides
        if (lowIntent.includes('刺激') || lowIntent.includes('intense') || lowIntent.includes('衝撃')) {
            effectiveAnswers.answers = { ...effectiveAnswers.answers, 'q2': 'r18' };
        } else if (lowIntent.includes('ソフト') || lowIntent.includes('マイルド') || lowIntent.includes('安全')) {
            effectiveAnswers.answers = { ...effectiveAnswers.answers, 'q2': 'g' };
        }

        // 3. Emotional/Story Overrides
        if (lowIntent.includes('感情') || lowIntent.includes('心情')) {
            effectiveAnswers.answers = { ...effectiveAnswers.answers, 'q3': 'relation' };
        } else if (lowIntent.includes('設定') || lowIntent.includes('世界観')) {
            effectiveAnswers.answers = { ...effectiveAnswers.answers, 'q3': 'story' };
        }
    });

    const sortedCandidates = works
        .map(work => {
            const baseScore = calculateScore(work, effectiveAnswers);
            // Add a small random boost (0-3 points) to ensure variety in repeated adjustments
            const randomBoost = Math.random() * 3;
            return { ...work, score: baseScore + randomBoost };
        })
        .sort((a, b) => b.score - a.score);

    // [Optimization] Stratified Sampling for "Wildcard"
    // Top 7: Best matches (High confidence) - Optimized for speed while maintaining quality
    const topTier = sortedCandidates.slice(0, 7);

    // Wildcard: Pick 3 random items from the next 20 candidates (Rank 8-27)
    // These serve as the "大穴" (Dark Horse) pool for the AI's "Abyss" pick
    const secondTier = sortedCandidates.slice(7, 27);
    const wildcards = secondTier
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 3); // Pick 3 wildcards

    // Combined Candidate Pool (Total 10) - Optimized from 30 for faster AI response
    const finalCandidates = [...topTier, ...wildcards];

    // 2. Deep Semantic Ranking (AI Stage)
    try {
        const { rankWorksAction } = await import('@/app/actions');
        const latestIntent = refinementHistory[refinementHistory.length - 1] || 'なし';
        const userProfile = generateSemanticProfile(userAnswers, latestIntent);

        console.log('AI Profiling:', userProfile);

        const { rankedWorks, numaType } = await rankWorksAction(userProfile, finalCandidates, refinementHistory, personaId);

        return {
            works: rankedWorks.map((rw: any) => ({
                ...rw,
                score: rw.aiScore || 0,
                reason: rw.aiReason || rw.reason,
                description: rw.aiDescription || rw.description
            })),
            numaType: numaType || '未知の深淵の旅人'
        };

    } catch (aiError) {
        console.warn('AI Ranking failed, falling back to effective scoring:', aiError);
        return {
            works: finalCandidates.slice(0, 3).map((w: any) => ({
                ...w,
                reason: 'エージェントが混雑していますが、あなたの回答傾向からこの作品が確実に刺さると判断しました。',
            })),
            numaType: '直感的な探索者'
        };
    }
}

/**
 * Optimized Pivot Recommendation (Swamp Expansion)
 * Finds works with high item-to-item similarity based on Tags and Genres.
 * Bypasses full user scoring for sub-second response.
 */
export async function getPivotRecommendations(anchorWork: Work, currentIds: string[] = [], personaId: PersonaId = 'butler'): Promise<{ works: (Work & { score: number })[]; numaType: string }> {
    // 1. Fetch Candidates (Same Media, High Similarity Potential)
    const { data: candidates, error } = await supabase
        .from('works')
        .select(`
            *,
            work_links (
                label,
                url
            )
        `)
        .eq('media', anchorWork.media)
        .neq('id', anchorWork.id)
        .limit(100);

    if (error || !candidates) {
        console.error('Pivot fetch error:', error);
        return { works: [], numaType: '迷宮の行き止まり' };
    }

    // 2. Client-side Similarity Scoring
    const scoredCandidates = candidates.map((item: any) => {
        const work: Work = {
            id: item.id,
            external_id: item.external_id,
            title: item.title,
            title_en: item.title_en,
            title_jp: item.title_jp,
            media: item.media as MediaType,
            rating: item.rating,
            description: item.description,
            thumbnailUrl: item.thumbnail_url,
            links: item.work_links || [],
            tags: {
                depth: item.depth,
                intensity: item.intensity,
                commitment: item.commitment ?? 1,
                direction: item.direction,
                aftertaste: item.aftertaste,
                filter: item.filter,
            },
            reason: item.reason,
            genres: item.genres,
            weighted_genres: item.weighted_genres
        };

        let simScore = 0;

        // A. Genre Overlap
        const anchorGenres = anchorWork.genres || [];
        const targetGenres = work.genres || [];
        const sharedGenres = targetGenres.filter(g => anchorGenres.includes(g));
        simScore += sharedGenres.length * 10;

        // B. Tag Similarity (The core "Vibe" check)
        const anchorStrongTags = (anchorWork.weighted_genres || [])
            .filter(g => g.value >= 70) // User requested threshold 70
            .map(g => g.name);

        const targetStrongTags = (work.weighted_genres || [])
            .filter(g => g.value >= 70)
            .map(g => g.name);

        const sharedStrongTags = targetStrongTags.filter(t => anchorStrongTags.includes(t));
        simScore += sharedStrongTags.length * 15;

        // C. Direction/Aftertaste Exact Match
        if (work.tags.direction === anchorWork.tags.direction) simScore += 5;
        if (work.tags.aftertaste === anchorWork.tags.aftertaste) simScore += 5;

        return { ...work, simScore };
    });

    // 3. Filter & Sort
    const sorted = scoredCandidates
        .filter(w => !currentIds.includes(w.id))
        .sort((a, b) => b.simScore - a.simScore)
        .slice(0, 6);

    // 4. AI Deep Dive
    try {
        const { rankPivotWorksAction } = await import('@/app/actions');
        const { rankedWorks, numaType } = await rankPivotWorksAction(anchorWork, sorted, personaId);
        return {
            works: rankedWorks.map(w => ({
                ...w,
                reason: w.aiReason || w.reason, // Ensure AI text overrides DB text
                description: w.aiDescription || w.description, // Ensure AI translation overrides DB text
                score: w.aiScore || 85
            })),
            numaType: numaType || `「${anchorWork.title}」の追随者`
        };
    } catch (e) {
        console.warn('Pivot AI failed, using raw similarity:', e);
        return {
            works: sorted.slice(0, 3).map(w => ({
                ...w,
                reason: '成分分析により、この作品との高い親和性が確認されました。',
                score: 85
            })),
            numaType: `「${anchorWork.title}」の追随者`
        };
    }
}
