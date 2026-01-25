export type MediaType = 'anime' | 'manga' | 'lightnovel' | 'any';

export interface ColorProfile {
    temp: number;       // 0 (Cold) - 100 (Hot)
    brightness: number; // 0 (Dark) - 100 (Bright)
    saturation: number; // 0 (Low) - 100 (High)
    contrast: number;   // 0 (Soft) - 100 (Hard)
    hueShift: number;   // -180 - 180
    texture?: 'smooth' | 'grain' | 'vignette';
}

export interface Choice {
    id: string;
    label: string;
    colorProfile: ColorProfile;
    tags: string[]; // for recommendation matching
}

export interface Question {
    id: string;
    text: string;
    choices: Choice[];
    mediaSpecific?: MediaType;
}

export interface RecommendationTag {
    depth: number;      // 0-2 (Light, Otaku, Deep)
    intensity: number;  // 0-2 (G, R15, R18)
    commitment?: number; // 0-2 (Quick, Moderate, Heavy)
    direction: 'story' | 'energy' | 'relation';
    aftertaste: 'refresh' | 'lingering' | 'dark';
    filter: 'avoid' | 'neutral' | 'welcome'; // Filter element
}

export interface Work {
    id: string;
    external_id?: string; // ISBN, JAN, MAL_ID etc.
    title: string;
    title_en?: string;
    title_jp?: string;
    media: MediaType;
    rating: 'G' | 'R15' | 'R18';
    description: string;
    thumbnailUrl: string;
    links: {
        label: string;
        url: string;
    }[];
    tags: RecommendationTag;
    reason: string;
    genres?: string[];
    weighted_genres?: { name: string; value: number }[];
    aiReason?: string;
    aiScore?: number;
    aiDescription?: string;
}

export interface UserAnswers {
    media: MediaType;
    answers: Record<string, string>; // questionId -> choiceId
}

export type PersonaId = 'butler' | 'curator' | 'buddy' | 'devotee';

export interface Persona {
    id: PersonaId;
    name: string;
    description: string;
    color: string;
}
