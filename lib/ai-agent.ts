import { Work, PersonaId } from '../types';

export interface NIAgentResult {
    rankedWorks: (Work & { aiReason: string; aiScore: number; aiDescription?: string })[];
    numaType?: string; // e.g. "Philosopher of Cyberpunk"
}

export interface NIAIProvider {
    rankWorks(
        userProfile: string,
        candidateWorks: Work[],
        refinementHistory?: string[],
        personaId?: PersonaId // Optional for backward compatibility, defaults to 'butler'
    ): Promise<NIAgentResult>;
    rankPivotWorks(anchorWork: Work, candidates: Work[], personaId?: PersonaId): Promise<NIAgentResult>;
    generateAdjustmentOptions(work: Work, userProfile: string): Promise<string[]>;
}

export type AIProviderName = 'GEMINI' | 'OPENAI';

export async function getAIProvider(name?: string): Promise<NIAIProvider> {
    const provider = (name || process.env.AI_PROVIDER || 'GEMINI').toUpperCase() as AIProviderName;

    if (provider === 'OPENAI') {
        const { OpenAIAIProvider } = await import('./openai');
        return new OpenAIAIProvider();
    } else {
        const { GeminiAIProvider } = await import('./gemini');
        return new GeminiAIProvider();
    }
}
