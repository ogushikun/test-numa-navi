import { Work } from '@/types';

export const SAMPLE_WORKS: Work[] = [
    {
        id: '1',
        title: '海辺の異端児（仮）',
        media: 'anime',
        rating: 'G',
        description: '離島で繰り広げられる、音と映像の実験的な試みが光る青春群像劇。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600&auto=format&fit=crop',
        links: [
            { label: 'Prime Videoで見る', url: '#' },
            { label: 'Blu-rayを買う', url: '#' }
        ],
        tags: {
            depth: 1,
            intensity: 0,
            direction: 'story',
            aftertaste: 'refresh',
            filter: 'neutral'
        },
        reason: '爽やかな映像美と、少しだけ癖のある構成があなたの感性に響きます。'
    },
    {
        id: '2',
        title: '深淵のアルキメデス',
        media: 'manga',
        rating: 'R15',
        description: '数学の美しさと狂気が交錯する、19世紀ヨーロッパを舞台にした歴史サスペンス。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=600&auto=format&fit=crop',
        links: [
            { label: 'コミックシーモアで読む', url: '#' }
        ],
        tags: {
            depth: 2,
            intensity: 1,
            direction: 'energy',
            aftertaste: 'lingering',
            filter: 'welcome'
        },
        reason: '緻密な筆致と圧倒的な情報量が、あなたの知的好奇心を深く満たすでしょう。'
    },
    {
        id: '3',
        title: '背徳のティータイム',
        media: 'lightnovel',
        rating: 'R18',
        description: '禁じられた関係性と、甘く溶けるような官能的な日常。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
        links: [
            { label: 'FANZAで購入', url: '#' }
        ],
        tags: {
            depth: 2,
            intensity: 2,
            direction: 'relation',
            aftertaste: 'dark',
            filter: 'welcome'
        },
        reason: '重厚な記述と、逃げ場のない関係性の執着が、心地よい闇を感じさせます。'
    },
    {
        id: '4',
        title: '銀河特急の落とし物',
        media: 'anime',
        rating: 'G',
        description: 'レトロフューチャーな宇宙を舞台にした、心温まる遺失物預かり所の物語。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '公式サイト', url: '#' }],
        tags: {
            depth: 0,
            intensity: 0,
            direction: 'story',
            aftertaste: 'refresh',
            filter: 'avoid'
        },
        reason: '誰にでもおすすめできる優しい物語が、あなたの心を癒やします。'
    },
    {
        id: '5',
        title: 'ブラインド・メイズ',
        media: 'manga',
        rating: 'R15',
        description: '視覚を失った主人公が、音だけで迷宮を脱出するソリッド・シチュエーション・スリラー。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '試し読み', url: '#' }],
        tags: {
            depth: 1,
            intensity: 1,
            direction: 'energy',
            aftertaste: 'lingering',
            filter: 'neutral'
        },
        reason: '緊迫感溢れる描写と、先の読めない展開があなたを釘付けにします。'
    },
    {
        id: '6',
        title: '放課後のアルケミスト',
        media: 'lightnovel',
        rating: 'G',
        description: 'ありふれた日常に魔法が混じる、少し不思議で甘酸っぱい部活動記録。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '書籍情報', url: '#' }],
        tags: {
            depth: 0,
            intensity: 0,
            direction: 'relation',
            aftertaste: 'refresh',
            filter: 'avoid'
        },
        reason: 'ライトな読み心地と、キャラクターたちの瑞々しい関係性が魅力です。'
    },
    {
        id: '7',
        title: '黒鋼のヴィヴァーチェ',
        media: 'anime',
        rating: 'R15',
        description: 'スチームパンクな世界で、音楽を武器に戦う反逆者たちの熱き共鳴。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581089781785-603411ffdaa7?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '配信サービスへ', url: '#' }],
        tags: {
            depth: 1,
            intensity: 1,
            direction: 'energy',
            aftertaste: 'refresh',
            filter: 'neutral'
        },
        reason: '圧倒的な熱量を誇るアクションと、力強いサウンドがあなたを鼓舞します。'
    },
    {
        id: '8',
        title: '夜の底のレクイエム',
        media: 'manga',
        rating: 'R18',
        description: '頽廃的な近未来都市で、愛と憎しみの境界線を彷徨う者たちの挽歌。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514306191717-452444c62d46?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '電子版はこちら', url: '#' }],
        tags: {
            depth: 2,
            intensity: 2,
            direction: 'relation',
            aftertaste: 'dark',
            filter: 'welcome'
        },
        reason: '重層的な感情の縺れと、容赦ない描写があなたの奥底に刺さります。'
    },
    {
        id: '9',
        title: '図書室の司書は語らない',
        media: 'lightnovel',
        rating: 'G',
        description: '大学の図書室を舞台に、古い本に隠された秘密を紐解くビブリオ・ミステリー。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '詳細ページ', url: '#' }],
        tags: {
            depth: 1,
            intensity: 0,
            direction: 'story',
            aftertaste: 'lingering',
            filter: 'neutral'
        },
        reason: '静謐な空気感と、知的な謎解きが心地よい余韻を残します。'
    },
    {
        id: '10',
        title: 'カレイドスコープ・ドリーム',
        media: 'anime',
        rating: 'G',
        description: '夢の中を渡り歩く案内人と、迷える少女の幻想的な旅。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
        links: [{ label: 'PVを視聴', url: '#' }],
        tags: {
            depth: 1,
            intensity: 0,
            direction: 'story',
            aftertaste: 'lingering',
            filter: 'neutral'
        },
        reason: '万華鏡のように変化する美しい世界観が、あなたの想像力を刺激します。'
    },
    {
        id: '11',
        title: 'ジャンクヤード・キングダム',
        media: 'manga',
        rating: 'G',
        description: 'ゴミ捨て場の王国で、ガラクタから魔法を生み出す少年たちの冒険譚。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf71ad1b717?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '連載サイト', url: '#' }],
        tags: {
            depth: 0,
            intensity: 0,
            direction: 'energy',
            aftertaste: 'refresh',
            filter: 'avoid'
        },
        reason: '何もないところから希望を作り出す熱いドラマが、元気をくれます。'
    },
    {
        id: '12',
        title: '硝子の仮面舞踏会',
        media: 'lightnovel',
        rating: 'R15',
        description: '嘘と真実が入り混じる社交界で、愛を偽り続けるスパイたちの恋。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '特設サイト', url: '#' }],
        tags: {
            depth: 1,
            intensity: 1,
            direction: 'relation',
            aftertaste: 'lingering',
            filter: 'neutral'
        },
        reason: '張り詰めた緊張感と、一瞬の情熱が織りなす関係性が絶妙です。'
    },
    {
        id: '13',
        title: 'デッドエンド・マエストロ',
        media: 'anime',
        rating: 'R18',
        description: '世界の終焉に、狂気の調べを奏で続ける音楽家たちの最期の饗宴。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
        links: [{ label: 'R18指定・公式サイト', url: '#' }],
        tags: {
            depth: 2,
            intensity: 2,
            direction: 'energy',
            aftertaste: 'dark',
            filter: 'welcome'
        },
        reason: '破滅へ向かう圧倒的な意志の力と、残酷な美しさに圧倒されるでしょう。'
    },
    {
        id: '14',
        title: '猫と珈琲と魔法の鍵',
        media: 'manga',
        rating: 'G',
        description: '街角の喫茶店に集まる、少し変わった客たちの不思議な日常オムニバス。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop',
        links: [{ label: 'コミックス情報', url: '#' }],
        tags: {
            depth: 0,
            intensity: 0,
            direction: 'relation',
            aftertaste: 'refresh',
            filter: 'avoid'
        },
        reason: '温かい珈琲のような優しさが、心に染み渡る一作です。'
    },
    {
        id: '15',
        title: '境界線のカルマ',
        media: 'lightnovel',
        rating: 'R15',
        description: '善悪の彼岸で、正義という名の罪を負う執行官の葛藤を描くハードボイルド。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1453721029662-b7bd3ef4e1ad?q=80&w=600&auto=format&fit=crop',
        links: [{ label: '試し読み', url: '#' }],
        tags: {
            depth: 2,
            intensity: 1,
            direction: 'story',
            aftertaste: 'dark',
            filter: 'neutral'
        },
        reason: '重厚なテーマと、逃れられない運命の重さが、深く考えさせます。'
    },
    {
        id: '16',
        title: '星屑のパレード',
        media: 'anime',
        rating: 'G',
        description: '廃材から楽器を作る少女たちが、宇宙一の音楽祭を目指す青春SF。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1459749411177-042180ceea72?q=80&w=600&auto=format&fit=crop',
        links: [{ label: 'dアニメストア', url: '#' }],
        tags: {
            depth: 1,
            intensity: 0,
            direction: 'energy',
            aftertaste: 'refresh',
            filter: 'avoid'
        },
        reason: '眩しいほどの輝きを放つ演出と、ひたむきな努力があなたの心を震わせます。'
    },
    {
        id: '17',
        title: '虚空のバベロニカ',
        media: 'manga',
        rating: 'R15',
        description: '言語が失われた世界で、唯一の「言葉」を探す少女の孤独な巡礼。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop',
        links: [{ label: 'eBookJapan', url: '#' }],
        tags: {
            depth: 2,
            intensity: 1,
            direction: 'story',
            aftertaste: 'lingering',
            filter: 'neutral'
        },
        reason: '圧倒的な静謐さと、一コマ一コマに込められた執念の筆致が、深い余韻を残します。'
    },
    {
        id: '18',
        title: '叛逆のクロニクル',
        media: 'lightnovel',
        rating: 'G',
        description: '魔法が支配する階級社会で、無能力者の少年が知識と策略で王座に挑む下克上。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1543003923-92600c596aa5?q=80&w=600&auto=format&fit=crop',
        links: [{ label: 'Amazon.co.jp', url: '#' }],
        tags: {
            depth: 1,
            intensity: 0,
            direction: 'story',
            aftertaste: 'refresh',
            filter: 'neutral'
        },
        reason: '緻密に組み上げられた逆転劇と、弱者が強者を凌駕する爽快感が魅力です。'
    },
    {
        id: '19',
        title: '真夜中のリフレイン',
        media: 'anime',
        rating: 'R18',
        description: '叶わぬ恋の痛みが結晶化し、街を侵食していく幻想的な心理ホラー。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop',
        links: [{ label: 'BD特装版サイト', url: '#' }],
        tags: {
            depth: 2,
            intensity: 2,
            direction: 'relation',
            aftertaste: 'dark',
            filter: 'welcome'
        },
        reason: '美しくも残酷な心象描写と、逃げ場のない関係性の泥沼が、あなたを離しません。'
    },
    {
        id: '20',
        title: '陽だまりのプレリュード',
        media: 'manga',
        rating: 'G',
        description: '盲目のバイオリニストと、彼の耳となる調律師の、静かな恋の始まり。',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465821185615-90ae3c2f2104?q=80&w=600&auto=format&fit=crop',
        links: [{ label: 'LINEマンガ', url: '#' }],
        tags: {
            depth: 0,
            intensity: 0,
            direction: 'relation',
            aftertaste: 'refresh',
            filter: 'avoid'
        },
        reason: '水彩画のように繊細な空気感と、優しい関係性に心が温まります。'
    }
];
