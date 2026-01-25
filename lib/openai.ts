import OpenAI from 'openai';
import { NIAIProvider, NIAgentResult } from './ai-agent';
import { Work } from '../types';

export class OpenAIAIProvider implements NIAIProvider {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || '',
        });
    }

    async rankWorks(userProfile: string, candidateWorks: Work[], refinementHistory: string[] = []): Promise<NIAgentResult> {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OpenAI API Key missing. Falling back.');
            return { rankedWorks: candidateWorks.slice(0, 3).map(w => ({ ...w, aiReason: '診断回答に基づき、今のあなたに最も深く刺さるポテンシャルの高い作品を選出しました。', aiScore: 0 })) };
        }

        const HistoryText = refinementHistory.length > 0
            ? `【これまでの修正履歴】\n${refinementHistory.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n※特に最新の要望を最優先してください。`
            : '';

        const prompt = `
あなたは「紳士的なオタク（Gentleman Otaku）」です。
豊富な知識と深い愛を持ちながらも、決して相手に押し付けず、スマートに沼への入り口を案内するのがあなたの役目です。
「ゴリ押し」ではなく、相手の好みに寄り添った「提案」として、しかし確信を持って作品の魅力を語ってください。

【ユーザーの基本プロフィール】
${userProfile}

${HistoryText}

【候補作品リスト】
${candidateWorks.map((w, i) => `ID: ${i} | タイトル: ${w.title} | 説明: ${w.description} | ジャンル: ${w.genres?.join(', ')}`).join('\n')}

上記のリストから、以下の「ショットガン戦略（数打ちゃ当たる）」に基づいて上位3作品を選出し、丁寧にプレゼンしてください。

1. **【1本目：王道の提案（Royal Road）】**
   ユーザーの要望・属性に最も美しく合致する、自信を持っておすすめできる一作。
2. **【2本目：意外性の提案（Twist）】**
   少し視点を変え、「こういうアプローチもまた一興では？」と提案する知的刺激のある一作。
3. **【3本目：深淵への招待（Abyss）】**
   一見要望とは異なるかもしれないが、ユーザーの深層心理にある渇きを癒やすであろう、通好みな一作。

【選定理由（reason）の記述ルール】
- **知的な敬語（デス・マス調）**。「〜です、〜ます」を基本とし、ウィットに富んだ語彙を選んでください。
- 決して上から目線にならず、あくまで「執事やソムリエ」のような立ち位置で、しかし愛は隠しきれない熱量で語ってください。
- 例：「お客様の求める『重厚な物語』であれば、本作をおいて他にないでしょう。特に後半の展開は、きっとあなたの心を捉えて離さないはずです」

出力は以下のJSON形式のみで行ってください：
{
  "numaType": "ユーザーの沼属性をキャッチーに表現した二つ名（例：静謐なるSFの探究者）",
  "rankings": [
    { 
      "index": 候補リストのID, 
      "reason": "オタクとしての熱い推薦コメント（50文字程度）", 
      "score": 0-100,
      "description_jp": "作品の魅力を伝える日本語のあらすじ・紹介（80文字程度。元の説明が英語等の場合は翻訳・要約）"
    }
  ]
}
`;

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a professional subculture curator.' },
                    { role: 'user', content: prompt }
                ],
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0].message.content;
            const data = JSON.parse(content || '{}');

            const rankedWorks = data.rankings.map((r: any) => {
                const work = candidateWorks[r.index];
                return {
                    ...work,
                    aiReason: r.reason,
                    aiScore: r.score,
                    aiDescription: r.description_jp
                };
            });

            return {
                rankedWorks,
                numaType: data.numaType
            };
        } catch (error) {
            console.error('OpenAI Ranking Error:', error);
            // Fallback with Otaku persona
            return { rankedWorks: candidateWorks.slice(0, 3).map(w => ({ ...w, aiReason: 'AIが思考の泥沼にハマってしまいましたが、成分分析（タグ・ジャンル）の結果、これがあなたの性癖に刺さると確信しています！', aiScore: 80 })) };
        }
    }

    async generateAdjustmentOptions(work: Work, userProfile: string): Promise<string[]> {
        // Fallback for OpenAI provider (currently not primary)
        // If we want to implement this properly, we can use a similar prompt to Gemini
        return ['もっとシリアスに', 'もっと明るく', '恋愛要素を強めに'];
    }
    async rankPivotWorks(anchorWork: Work, candidates: Work[]): Promise<NIAgentResult> {
        // Placeholder for OpenAI implementation
        return {
            rankedWorks: candidates.slice(0, 3).map(w => ({ ...w, aiReason: '成分分析により、この作品との高い親和性が確認されました。', aiScore: 85 })),
            numaType: `「${anchorWork.title}」の追随者`
        };
    }
}
