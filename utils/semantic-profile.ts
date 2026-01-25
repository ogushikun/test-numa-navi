import { UserAnswers, MediaType } from '../types';

/**
 * Generates a natural language description of the user's emotional and thematic preferences.
 */
export function generateSemanticProfile(userAnswers: UserAnswers, refinementFeedback?: string): string {
    const { answers, media } = userAnswers;

    const profiles: string[] = [];

    // Media orientation
    if (media !== 'any') {
        profiles.push(`${media === 'anime' ? 'アニメ' : media === 'manga' ? '漫画' : 'ライトノベル'}という媒体を好んでいます。`);
    } else {
        profiles.push('媒体を問わず、今の自分に最も刺さる作品を求めています。');
    }

    // Depth (q1)
    const depthMap: Record<string, string> = {
        'light': '気軽に楽しめる、明るくテンポの良い作品を求めています。',
        'otaku': 'ある程度の構成の深さや、ファンに支持される定番の魅力を重視しています。',
        'deep': '難解な設定や哲学的な問い、あるいは常軌を逸した表現が含まれる「深み」のある作品を強く求めています。'
    };
    if (answers['q1']) profiles.push(depthMap[answers['q1']]);

    // Intensity (q2)
    const intensityMap: Record<string, string> = {
        'safe': '過激な描写のない、誰でも安心して見られる全年齢向けの作品を求めています。',
        'edgy': 'ある程度のエッジや刺激（過激ではない程度の描写）を許容し、物語の深みを重視しています。',
        'aggressive': '非常にショッキングな展開や、タブーに踏み込んだ過激な描写、成人向けの熱量も厭いません。'
    };
    if (answers['q2']) profiles.push(intensityMap[answers['q2']]);

    // Direction (q3)
    const directionMap: Record<string, string> = {
        'story': '緻密な伏線や世界観の構築、物語の構造や展開そのものを楽しみたいと考えています。',
        'energy': '熱いバトルや狂気、あるいは凄まじい疾走感といった、圧倒的な熱量を求めています。',
        'relation': '心情の機微や執着、キャラクター同士の湿度のある密接な関係性を重視しています。'
    };
    if (answers['q3']) profiles.push(directionMap[answers['q3']]);

    // Aftertaste (q4)
    const aftertasteMap: Record<string, string> = {
        'refresh': '読了後は前向きな気持ちになれる、カタルシスや救いのある爽快な後味を好みます。',
        'lingering': '切なさやエモさ、あるいは考えさせられるような深く長く残る、少しほろ苦い余韻を求めています。',
        'dark': '救いのなさや狂気、あるいは絶望感すら感じる、心を抉るような「闇」の後味を積極的に受け入れたいと考えています。'
    };
    if (answers['q4']) profiles.push(aftertasteMap[answers['q4']]);

    // Commitment (q5)
    const commitmentMap: Record<string, string> = {
        'quick': '今は手軽に楽しめる、短編やサクッと満足できるボリュームの作品を求めています。',
        'moderate': '標準的な長さで、適度な没入感を持って楽しめる作品がちょうどいい気分です。',
        'heavy': '時間を忘れてのめり込めるような長編や、非常に密度が高く重厚な体験を求めています。'
    };
    if (answers['q5']) profiles.push(commitmentMap[answers['q5']]);

    // World Reality (q7)
    const worldMap: Record<string, string> = {
        'realistic': '舞台の「現実感」を重視しており、現代社会やリアルな心理描写に基づく物語を好みます。',
        'grounded': '非日常的な設定であっても、設定の納得感や地続きのリアリティがある世界を求めています。',
        'unreal': '異界や超常現象など、現実から大きく飛躍した「非現実的」な世界観への没入を望んでいます。'
    };
    if (answers['q7']) profiles.push(worldMap[answers['q7']]);

    // Character Drive (q8)
    const driveMap: Record<string, string> = {
        'virtue': 'キャラクターが善性や成長を糧に、前向きに物語を動かしていく展開を好みます。',
        'karma': '業（カルマ）や欠落、執着といった「負のエネルギー」が物語の推進力となる展開に惹かれます。',
        'chaos': 'キャラクターの逸脱した行動や予測不能なカオスさが、物語を突き動かしていく感覚を求めています。'
    };
    if (answers['q8']) profiles.push(driveMap[answers['q8']]);

    // Media Specific (q6)
    // We'll extract the label if possible or just use a generic mapping if we knew the labels
    if (answers['q6']) {
        profiles.push(`また、特に「${answers['q6']}」という要素にこだわって選びたいという強い意志があります。`);
    }

    // Refinement Feedback
    if (refinementFeedback && refinementFeedback !== 'なし') {
        profiles.push(`【これらを踏まえた今の気分】: ${refinementFeedback}`);
    }

    // Explicit decision points for AI to reference in 'reason'
    profiles.push('\n\n【ユーザーの意思決定ポイント（理由に含めるべき要素）】');
    if (media !== 'any') profiles.push(`- 媒体: ${media === 'anime' ? 'アニメ' : media === 'manga' ? '漫画' : 'ライトノベル'}`);
    if (answers['q1']) profiles.push(`- 作品の深度: ${depthMap[answers['q1']] || answers['q1']}`);
    if (answers['q2']) profiles.push(`- 刺激の強さ: ${intensityMap[answers['q2']] || answers['q2']}`);
    if (answers['q3']) profiles.push(`- 刺さる方向: ${directionMap[answers['q3']] || answers['q3']}`);
    if (answers['q4']) profiles.push(`- 後味の好み: ${aftertasteMap[answers['q4']] || answers['q4']}`);
    if (answers['q5']) profiles.push(`- ボリューム感: ${commitmentMap[answers['q5']] || answers['q5']}`);
    if (answers['q7']) profiles.push(`- 世界観の手触り: ${worldMap[answers['q7']] || answers['q7']}`);
    if (answers['q8']) profiles.push(`- キャラクターの駆動力: ${driveMap[answers['q8']] || answers['q8']}`);
    if (answers['q6']) profiles.push(`- 媒体別のこだわり: ${answers['q6']}`);

    return profiles.join(' ');
}
