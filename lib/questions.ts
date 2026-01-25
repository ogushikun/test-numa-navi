import { Question } from '../types';

export const QUESTIONS: Question[] = [
    {
        id: 'q0',
        text: '今日はどの媒体で“摂取”する？',
        choices: [
            {
                id: 'anime',
                label: 'アニメ（配信で観たい）',
                tags: ['anime'],
                colorProfile: { temp: 40, saturation: 70, brightness: 60, hueShift: 0, contrast: 60 }
            },
            {
                id: 'manga',
                label: '漫画（電子/紙で読みたい）',
                tags: ['manga'],
                colorProfile: { temp: 60, saturation: 50, brightness: 70, hueShift: 40, contrast: 50 }
            },
            {
                id: 'lightnovel',
                label: 'ライトノベル（文章で読みたい）',
                tags: ['lightnovel'],
                colorProfile: { temp: 50, saturation: 40, brightness: 80, hueShift: -30, contrast: 40 }
            },
            {
                id: 'any',
                label: 'どれでもOK（混ぜて提案）',
                tags: ['any'],
                colorProfile: { temp: 50, saturation: 60, brightness: 60, hueShift: 180, contrast: 50 }
            },
        ]
    },
    {
        id: 'q1',
        text: 'どの深さまで潜る？',
        choices: [
            {
                id: 'light',
                label: 'ライト（定番・入口）',
                tags: ['depth_0'],
                colorProfile: { temp: 30, saturation: 80, brightness: 90, hueShift: 10, contrast: 30 }
            },
            {
                id: 'otaku',
                label: 'オタク（刺さる名作・尖りもOK）',
                tags: ['depth_1'],
                colorProfile: { temp: 50, saturation: 60, brightness: 50, hueShift: -10, contrast: 60 }
            },
            {
                id: 'deep',
                label: 'ディープ（人を選ぶ/癖強/刺さり最優先）',
                tags: ['depth_2'],
                colorProfile: { temp: 80, saturation: 40, brightness: 20, hueShift: -40, contrast: 80 }
            },
        ]
    },
    {
        id: 'q2',
        text: '描写の攻め具合は？',
        choices: [
            {
                id: 'safe',
                label: '安心（全年齢）',
                tags: ['intensity_0'],
                colorProfile: { temp: 20, saturation: 40, brightness: 90, hueShift: 120, contrast: 20 }
            },
            {
                id: 'edgy',
                label: 'ちょい攻め（R15相当まで）',
                tags: ['intensity_1'],
                colorProfile: { temp: 60, saturation: 70, brightness: 40, hueShift: -60, contrast: 70 }
            },
            {
                id: 'aggressive',
                label: '攻めてもOK（成人向け含む）',
                tags: ['intensity_2'],
                colorProfile: { temp: 95, saturation: 90, brightness: 10, hueShift: -120, contrast: 90 }
            },
        ]
    },
    {
        id: 'q3',
        text: 'いま一番ほしい“刺さり”は？',
        choices: [
            {
                id: 'story',
                label: '物語・設定（世界観/構造/考察）',
                tags: ['direction_story'],
                colorProfile: { temp: 40, saturation: 50, brightness: 40, hueShift: 200, contrast: 60 }
            },
            {
                id: 'energy',
                label: '熱量・過剰（バトル/狂気/疾走感）',
                tags: ['direction_energy'],
                colorProfile: { temp: 90, saturation: 80, brightness: 50, hueShift: -20, contrast: 80 }
            },
            {
                id: 'relation',
                label: '関係性・執着（感情/湿度/背徳・官能）',
                tags: ['direction_relation'],
                colorProfile: { temp: 70, saturation: 60, brightness: 30, hueShift: -80, contrast: 70 }
            },
        ]
    },
    {
        id: 'q4',
        text: '後味はどれがいい？',
        choices: [
            {
                id: 'refresh',
                label: '爽快（救い/カタルシス）',
                tags: ['aftertaste_refresh'],
                colorProfile: { temp: 10, saturation: 90, brightness: 80, hueShift: 160, contrast: 40 }
            },
            {
                id: 'lingering',
                label: '余韻（切なさ/エモ/ほろ苦）',
                tags: ['aftertaste_lingering'],
                colorProfile: { temp: 50, saturation: 50, brightness: 40, hueShift: 40, contrast: 50 }
            },
            {
                id: 'dark',
                label: '闇（しんどい/救い薄めもOK）',
                tags: ['aftertaste_dark'],
                colorProfile: { temp: 90, saturation: 30, brightness: 10, hueShift: -160, contrast: 90 }
            },
        ]
    },
    {
        id: 'q5',
        text: '今日はどれくらい“持っていかれたい”？',
        choices: [
            {
                id: 'quick',
                label: 'サクッと（軽め/短めで満足）',
                tags: ['commitment_short'],
                colorProfile: { temp: 30, saturation: 60, brightness: 70, hueShift: 60, contrast: 30 }
            },
            {
                id: 'moderate',
                label: 'ちょうどいい（標準の没入感）',
                tags: ['commitment_mid'],
                colorProfile: { temp: 50, saturation: 50, brightness: 50, hueShift: 0, contrast: 50 }
            },
            {
                id: 'heavy',
                label: 'ガッツリ（長編/重めもOK）',
                tags: ['commitment_long'],
                colorProfile: { temp: 70, saturation: 70, brightness: 30, hueShift: -20, contrast: 70 }
            },
        ]
    },
    // Anime Specific
    {
        id: 'q6',
        text: 'アニメ：何で刺す？',
        mediaSpecific: 'anime',
        choices: [
            {
                id: 'visual',
                label: '映像・演出（作画/構図/音）',
                tags: ['finish_visual'],
                colorProfile: { temp: 40, saturation: 80, brightness: 60, hueShift: 100, contrast: 60 }
            },
            {
                id: 'script',
                label: '脚本・構成（伏線/完成度）',
                tags: ['finish_script'],
                colorProfile: { temp: 50, saturation: 50, brightness: 40, hueShift: 200, contrast: 70 }
            },
            {
                id: 'vibe',
                label: '雰囲気・癖（空気/こだわり）',
                tags: ['finish_vibe'],
                colorProfile: { temp: 60, saturation: 40, brightness: 30, hueShift: -30, contrast: 50 }
            },
        ]
    },
    // Manga Specific
    {
        id: 'q6',
        text: '漫画：読み味は？',
        mediaSpecific: 'manga',
        choices: [
            {
                id: 'flow',
                label: '読みやすさ（テンポ/分かりやすさ）',
                tags: ['finish_flow'],
                colorProfile: { temp: 60, saturation: 60, brightness: 80, hueShift: 20, contrast: 40 }
            },
            {
                id: 'artistry',
                label: '作家性（癖/尖り/実験的）',
                tags: ['finish_artistry'],
                colorProfile: { temp: 70, saturation: 40, brightness: 50, hueShift: -50, contrast: 80 }
            },
            {
                id: 'humidity',
                label: '湿度（関係性の熱/感情の圧）',
                tags: ['finish_humidity'],
                colorProfile: { temp: 80, saturation: 70, brightness: 30, hueShift: -90, contrast: 60 }
            },
        ]
    },
    // Light Novel Specific
    {
        id: 'q6',
        text: 'ラノベ：文章の密度は？',
        mediaSpecific: 'lightnovel',
        choices: [
            {
                id: 'light_text',
                label: '軽い（会話多め/サクサク）',
                tags: ['finish_light_text'],
                colorProfile: { temp: 40, saturation: 40, brightness: 90, hueShift: 50, contrast: 20 }
            },
            {
                id: 'balance',
                label: 'バランス（読みやすさと厚み）',
                tags: ['finish_balance'],
                colorProfile: { temp: 50, saturation: 50, brightness: 60, hueShift: 0, contrast: 40 }
            },
            {
                id: 'thick',
                label: '濃い（地の文/心理/設定が厚い）',
                tags: ['finish_thick'],
                colorProfile: { temp: 60, saturation: 60, brightness: 40, hueShift: -40, contrast: 70 }
            },
        ]
    },
    // Any/Mixed Specific
    {
        id: 'q6',
        text: '優先は？',
        mediaSpecific: 'any',
        choices: [
            {
                id: 'streaming',
                label: '今すぐ観れる（配信優先）',
                tags: ['finish_streaming'],
                colorProfile: { temp: 40, saturation: 80, brightness: 70, hueShift: 200, contrast: 40 }
            },
            {
                id: 'ebook',
                label: '今すぐ読める（電子書籍優先）',
                tags: ['finish_ebook'],
                colorProfile: { temp: 60, saturation: 50, brightness: 80, hueShift: 30, contrast: 30 }
            },
            {
                id: 'impact',
                label: '刺さり優先（媒体は問わない）',
                tags: ['finish_impact'],
                colorProfile: { temp: 80, saturation: 70, brightness: 40, hueShift: -10, contrast: 80 }
            },
        ]
    },
    // Extra Depth - Q7
    {
        id: 'q7',
        text: '舞台の“現実感”はどれがいい？',
        choices: [
            {
                id: 'realistic',
                label: '現実寄り（現代/社会/心理）',
                tags: ['world_realistic'],
                colorProfile: { temp: 50, saturation: 20, brightness: 60, hueShift: 0, contrast: 40 }
            },
            {
                id: 'grounded',
                label: '地続き（非日常だけど納得感あり）',
                tags: ['world_grounded'],
                colorProfile: { temp: 50, saturation: 50, brightness: 50, hueShift: 40, contrast: 50 }
            },
            {
                id: 'unreal',
                label: '非現実寄り（異界/超常/飛躍）',
                tags: ['world_unreal'],
                colorProfile: { temp: 50, saturation: 80, brightness: 40, hueShift: 180, contrast: 70 }
            },
        ]
    },
    // Extra Depth - Q8
    {
        id: 'q8',
        text: 'キャラが動く理由はどれが好み？',
        choices: [
            {
                id: 'virtue',
                label: '善性・成長（前向きに進む）',
                tags: ['drive_virtue'],
                colorProfile: { temp: 20, saturation: 70, brightness: 80, hueShift: 120, contrast: 30 }
            },
            {
                id: 'karma',
                label: '業・闇（欠落/執着で進む）',
                tags: ['drive_karma'],
                colorProfile: { temp: 80, saturation: 60, brightness: 20, hueShift: -40, contrast: 80 }
            },
            {
                id: 'chaos',
                label: 'カオス（逸脱/予測不能で進む）',
                tags: ['drive_chaos'],
                colorProfile: { temp: 95, saturation: 90, brightness: 10, hueShift: -120, contrast: 95 }
            },
        ]
    },
];
