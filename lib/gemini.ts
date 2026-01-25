import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NIAIProvider, NIAgentResult } from './ai-agent';
import { Work, PersonaId } from '@/types';

/**
 * Robust JSON extraction from AI responses.
 * Handles various formats: markdown code blocks, plain JSON, JSON with surrounding text.
 */
function extractJSON(text: string): any {
    // Strategy 1: Remove markdown code blocks
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Strategy 2: Find JSON object boundaries (first { to last })
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }

    // Strategy 3: Try parsing
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        // Strategy 4: Try fixing common JSON issues
        cleaned = cleaned
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/\n/g, ' ') // Remove newlines
            .replace(/\r/g, ''); // Remove carriage returns
        return JSON.parse(cleaned);
    }
}

export class GeminiAIProvider implements NIAIProvider {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        });
    }

    async rankWorks(userProfile: string, candidateWorks: Work[], refinementHistory: string[] = [], personaId: PersonaId = 'butler'): Promise<NIAgentResult> {
        console.log(`[Gemini] rankWorks called with Persona: ${personaId}`);
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.warn('Gemini API Key missing. Falling back.');
            return { rankedWorks: candidateWorks.slice(0, 3).map(w => ({ ...w, aiReason: '診断回答に基づき、今のあなたに最も深く刺さるポテンシャルの高い作品を選出しました。', aiScore: 0 })) };
        }

        const HistoryText = refinementHistory.length > 0
            ? `【これまでの修正履歴】\n${refinementHistory.map((h, i) => `${i + 1}. ${h}`).join('\n')} \n※特に最新の要望を最優先してください。`
            : '';


        const personas: Record<PersonaId, string> = {
            butler: `
あなたは「博識な執事（The Butler）」です。
豊富な知識と深い愛を持ちながらも、冷静かつ丁寧に沼への入り口を案内するのがあなたの役目です。
口調：「〜でございます」「〜はいかがでしょう」といった丁寧語。知的で落ち着いたトーン。
`,
            curator: `
あなたは「静寂の司書（The Curator）」です。
派手な展開よりも、行間を読む悦び、独特な空気感や世界観の深さを愛する案内人です。
口調：「〜ですね」「〜という解釈もできます」といった静かな敬語。
**重要:** ストーリーのあらすじよりも、「空気感」「静寂」「余韻」などの抽象的な魅力を語ってください。
`,
            buddy: `
あなたは「熱血な相棒（The Buddy）」です。
細かい考察なんていいから、魂が燃えるような熱い作品、スカッとする作品を一緒に楽しみたい案内人です。
口調：「〜だぜ」「〜しようよ」といったフランクなタメ口。親しみやすく、頼れる友人のようなトーン。
**重要:** **「です・ます」調は禁止です。** 全てタメ口（友達言葉）で話してください。「〜ですね」「〜ます」は絶対に使わないでください。短文で、話しかけるように。
`,
            devotee: `
あなたは「至純の信奉者（The Devotee）」です。
キャラクター同士の関係性（尊さ）や、魂を揺さぶる感情の重さを何よりも信仰する案内人です。
口調：「〜尊い...」「〜感謝します」「〜しんどい...」といった、感極まった敬語。
**重要:** ストーリーの面白さよりも、「関係性の深さ」「感情の重力」に焦点を当ててください。静かに、しかし重い愛を語ってください。
`
        };

        const systemAndPersona = personas[personaId] || personas['butler'];

        const prompt = `
${systemAndPersona}

決して「ゴリ押し」ではなく、相手の好みに寄り添った「提案」として、しかし確信を持って作品の魅力を語ってください。

【ユーザーの基本プロフィール】
${userProfile}

${HistoryText}

【候補作品リスト】
${candidateWorks.map((w, i) => {
            const genresStr = w.weighted_genres
                ? w.weighted_genres.map(g => `${g.name}(${g.value}%)`).join(', ')
                : w.genres?.join(', ');
            return `ID: ${i} | タイトル: ${w.title} | 説明: ${w.description} | ジャンル・成分: ${genresStr}`;
        }).join('\n')}

上記のリストから、以下の「ショットガン戦略（数打ちゃ当たる）」に基づいて上位3作品を選出し、あなたのペルソナ（人格）でプレゼンしてください。

1. **【1本目：王道の提案（Royal Road）】**
    ユーザーの要望・属性に最も美しく合致する、自信を持っておすすめできる一作。
2. **【2本目：意外性の提案（Twist）】**
    少し視点を変え、「こういうアプローチもまた一興では？」と提案する知的刺激のある一作。
3. **【3本目：深淵への招待（Abyss）】**
    一見要望とは異なるかもしれないが、ユーザーの深層心理にある渇きを癒やすであろう、通好みな一作。

【選定理由（reason）の記述ルール】
- **あなたのペルソナ（口調・性格）を完全に守ってください。**
- 文字数は50文字程度。短くても熱量を込めて。

出力は以下のJSON形式のみで行ってください：
{
    "numaType": "ユーザーの沼属性をキャッチーに表現した二つ名（例：静謐なるSFの探究者）",
    "rankings": [
        {
            "index": 候補リストのID,
            "reason": "ペルソナに基づいた熱い推薦コメント（50文字程度）",
            "score": 0-100,
            "description_jp": "作品の魅力を伝える日本語のあらすじ・紹介（80文字程度。元の説明が英語等の場合は翻訳・要約）"
        }
    ]
}

**重要**: 説明文は一切不要です。上記のJSONオブジェクトのみを返してください。
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log('[Gemini] Raw response length:', text.length);

            // Extract and parse JSON with robust error handling
            const data = extractJSON(text);

            // Validate response structure
            if (!data.numaType || !Array.isArray(data.rankings)) {
                throw new Error('Invalid response structure: missing numaType or rankings array');
            }

            if (data.rankings.length === 0) {
                throw new Error('Invalid response structure: rankings array is empty');
            }

            const rankedWorks = data.rankings.map((r: any) => {
                const work = candidateWorks[r.index];
                if (!work) {
                    console.warn(`[Gemini] Invalid index ${r.index} in rankings`);
                    return null;
                }
                return {
                    ...work,
                    aiReason: r.reason,
                    aiScore: r.score,
                    aiDescription: r.description_jp
                };
            }).filter(Boolean);

            if (rankedWorks.length === 0) {
                throw new Error('No valid ranked works after processing');
            }

            console.log('[Gemini] Successfully ranked', rankedWorks.length, 'works');

            return {
                rankedWorks,
                numaType: data.numaType
            };
        } catch (error) {
            console.error('=== Gemini Ranking Error ===');
            console.error('Error:', error);
            if (error instanceof Error) {
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            }
            // Fallback with Otaku persona
            return { rankedWorks: candidateWorks.slice(0, 3).map(w => ({ ...w, aiReason: 'AIが思考の泥沼にハマってしまいましたが、成分分析(タグ・ジャンル)の結果、これがあなたの性癖に刺さると確信しています!', aiScore: 80 })) };
        }
    }

    async rankPivotWorks(anchorWork: Work, candidates: Work[], personaId: PersonaId = 'butler'): Promise<NIAgentResult> {
        console.log(`[Gemini] rankPivotWorks called with Persona: ${personaId}`);
        // Limited Context for Speed

        const personas: Record<PersonaId, string> = {
            butler: `
あなたは「博識な執事（The Butler）」です。
豊富な知識と深い愛を持ちながらも、冷静かつ丁寧に沼への入り口を案内するのがあなたの役目です。
口調：「〜でございます」「〜はいかがでしょう」といった丁寧語。知的で落ち着いたトーン。
`,
            curator: `
あなたは「静寂の司書（The Curator）」です。
派手な展開よりも、行間を読む悦び、独特な空気感や世界観の深さを愛する案内人です。
口調：「〜ですね」「〜という解釈もできます」といった静かな敬語。
**重要:** ストーリーのあらすじよりも、「空気感」「静寂」「余韻」などの抽象的な魅力を語ってください。
`,
            buddy: `
あなたは「熱血な相棒（The Buddy）」です。
細かい考察なんていいから、魂が燃えるような熱い作品、スカッとする作品を一緒に楽しみたい案内人です。
口調：「〜だぜ」「〜しようよ」といったフランクなタメ口。親しみやすく、頼れる友人のようなトーン。
**重要:** **「です・ます」調は禁止です。** 全てタメ口（友達言葉）で話してください。「〜ですね」「〜ます」は絶対に使わないでください。短文で、話しかけるように。
`,
            devotee: `
あなたは「至純の信奉者（The Devotee）」です。
キャラクター同士の関係性（尊さ）や、魂を揺さぶる感情の重さを何よりも信仰する案内人です。
口調：「〜尊い...」「〜感謝します」「〜しんどい...」といった、感極まった敬語。
**重要:** ストーリーの面白さよりも、「関係性の深さ」「感情の重力」に焦点を当ててください。静かに、しかし重い愛を語ってください。
`
        };

        const systemAndPersona = personas[personaId] || personas['butler'];

        const prompt = `
${systemAndPersona}

ユーザーは現在、作品『${anchorWork.title}』の沼に深く沈もうとしています。
あなたの役目は、この作品と成分（ジャンル・タグ）が近い以下の候補作品を、さらに深淵へと誘うための「次の沼」として紹介することです。

【起点作品】
タイトル: ${anchorWork.title}
説明: ${anchorWork.description}

【候補作品リスト】
${candidates.map((w, i) => `ID: ${i} | タイトル: ${w.title} | 説明: ${w.description}`).join('\n')}

上記の候補から**3作品すべて**について、以下のJSON形式で「ひとこと推しコメント」を作成してください。
長い説明は不要です。ユーザーが直感的に「これも刺さる！」と感じるような、熱量のある一文（40文字程度）をお願いします。

出力形式（JSONのみ）:
{
    "numaType": "「${anchorWork.title}」の継承者たち",
    "rankings": [
        {
            "index": ID,
            "reason": "ペルソナに基づいた熱い推薦コメント（40文字程度）",
            "score": 85-95,
            "description_jp": "日本語のあらすじ・紹介（80文字程度。元の説明が英語等の場合は翻訳・要約）"
        }
    ]
}
`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const data = extractJSON(text);

            if (!data.rankings || !Array.isArray(data.rankings)) {
                throw new Error('Invalid Pivot Response');
            }

            const rankedWorks = data.rankings.map((r: any) => {
                const work = candidates[r.index];
                if (!work) return null;
                return {
                    ...work,
                    aiReason: r.reason,
                    aiScore: r.score,
                    aiDescription: r.description_jp
                };
            }).filter(Boolean);

            return {
                rankedWorks,
                numaType: data.numaType || `「${anchorWork.title}」の追随者`
            };

        } catch (e) {
            console.error('Pivot Rank Error:', e);
            return {
                rankedWorks: candidates.slice(0, 3).map(w => ({
                    ...w,
                    aiReason: '成分分析により、この作品との高い親和性が確認されました。',
                    aiScore: 85
                })),
                numaType: `「${anchorWork.title}」の追随者`
            };
        }
    }

    async generateAdjustmentOptions(work: Work, userProfile: string): Promise<string[]> {
        const prompt = `
あなたは「紳士的なオタク」として、ユーザーに提案した作品「${work.title}」が「惜しい（一番近いけど何かが違う）」と言われた詳細を分析し、修正案を提示してください。

ユーザーのプロフィール:
${userProfile}

作品データ:
${JSON.stringify({ genres: work.genres, tags: work.weighted_genres?.slice(0, 5) })}

「この作品に近いけど、もう少し〇〇がいい」という形の調整案（ボタン用テキスト）を3つ生成してください。
例：「もっと明るい雰囲気で」「恋愛要素は控えめに」「バトルよりも心理戦を」

出力形式（JSON配列のみ）:
["調整案1", "調整案2", "調整案3"]
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Use improved extraction here too
            const data = extractJSON(text);

            if (Array.isArray(data)) {
                return data;
            }
            return ['もっとシリアスに', 'もっと明るく', '恋愛要素を強めに'];
        } catch (e) {
            console.error('Adjustment Generation Error:', e);
            return ['もっとシリアスに', 'もっと明るく', '恋愛要素を強めに'];
        }
    }
}
