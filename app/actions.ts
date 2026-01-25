'use server';

import { getAIProvider } from '@/lib/ai-agent';
import { Work, PersonaId } from '@/types';

/**
 * Server Action to execute AI ranking securely on the server.
 * This ensures API keys are accessible and not exposed to the client.
 */
export async function rankWorksAction(userProfile: string, candidateWorks: Work[], refinementHistory: string[] = [], personaId: PersonaId = 'butler') {
    try {
        console.log('--- rankWorksAction Started ---');
        const aiProvider = await getAIProvider(); // Will use server env vars
        const result = await aiProvider.rankWorks(userProfile, candidateWorks, refinementHistory, personaId);
        console.log('--- rankWorksAction Completed ---');
        return result;
    } catch (error) {
        console.error('Error in rankWorksAction:', error);
        // Return a safe fallback structure
        return {
            rankedWorks: candidateWorks.slice(0, 3).map(w => ({
                ...w,
                aiReason: '申し訳ありません。現在、熱量の高いオタクAIが混雑により応答できませんでした。',
                aiScore: 0
            })),
            numaType: 'サーバー通信のエラー'
        };
    }
}

export async function rankPivotWorksAction(anchorWork: Work, candidateWorks: Work[], personaId: PersonaId = 'butler') {
    try {
        const aiProvider = await getAIProvider();
        return await aiProvider.rankPivotWorks(anchorWork, candidateWorks, personaId);
    } catch (error) {
        console.error('Error in rankPivotWorksAction:', error);
        return {
            rankedWorks: candidateWorks.slice(0, 3).map(w => ({
                ...w,
                aiReason: '申し訳ありません。現在、熱量の高いオタクAIが混雑により応答できませんでした。',
                aiScore: 0
            })),
            numaType: 'サーバー通信のエラー'
        };
    }
}

export async function generateAdjustmentOptionsAction(work: Work, userProfile: string) {
    const aiProvider = await getAIProvider();
    return await aiProvider.generateAdjustmentOptions(work, userProfile);
}
