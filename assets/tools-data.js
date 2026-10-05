/*
 * ツール情報の一元管理ファイル(ここだけ編集すればOK)
 * ホームページのカード・検索・カテゴリー・人気/新着・sitemap.xml がここから生成されます。
 *
 * versions の値:
 *   'yes'     = 対応(確認済み)
 *   'partial' = 一部のみ対応 → note に理由を書く
 *   'unknown' = 未確認(画面には「？」で表示。確認でき次第 'yes'/'partial' に変更)
 *
 * isNew: true にすると「新着ツール」に出ます。added(YYYY-MM-DD) は新着の並び順に使います。
 * updated(任意): 実際に機能や内容を更新した日だけ書く。sitemap の lastmod になります。
 */
window.MC_SITE = {
  name: 'マイクラ便利ツール集',
  baseUrl: 'https://tasotaso55.github.io/minecraft-tools/',
  categories: [
    { id: 'build',   name: '建築',           icon: '🏗', desc: '円・球・ドームなど、建築の下書きと必要数の確認' },
    { id: 'coords',  name: '座標・探索',     icon: '🧭', desc: 'ネザー座標・距離・チャンクなど、移動と探索の計算' },
    { id: 'items',   name: 'アイテム・計算', icon: '🧮', desc: 'スタック換算など、アイテム数の計算' },
    { id: 'enchant', name: 'エンチャント・装備', icon: '✨', desc: 'エンチャントの付与対象・最大レベル・競合' },
    { id: 'villager',name: '村人・取引',     icon: '🏘', desc: '職業別の取引内容の確認' }
  ],
  tools: [
    {
      id: 'circle', name: 'マイクラ円・球・ドーム生成器', shortName: '円・球生成器', icon: '⭕',
      url: 'circle/', category: 'build',
      summary: '円・楕円・球・ドームのブロック配置を、上から見た図と層ごとの表示で確認。必要ブロック数の計算・画像保存に対応。',
      versions: { java: 'yes', bedrock: 'yes', note: '' },
      keywords: ['円','円形','丸','サークル','楕円','球','ドーム','作り方','建築','ブロック数','circle','sphere','dome'],
      related: ['stack', 'memo', 'chunk', 'distance'],
      isPopular: true, isNew: false
    },
    {
      id: 'nether', name: 'マイクラ ネザー座標計算機', shortName: 'ネザー座標計算', icon: '🔁',
      url: 'nether/', category: 'coords',
      summary: 'オーバーワールドとネザーの座標を相互に変換。ネザーゲートの位置合わせや /tp コマンドのコピーに。',
      versions: { java: 'yes', bedrock: 'yes', note: '' },
      keywords: ['ネザー','ゲート','ポータル','8倍','座標変換','オーバーワールド','tp','nether','portal'],
      related: ['memo', 'distance', 'chunk'],
      isPopular: true, isNew: false
    },
    {
      id: 'stack', name: 'マイクラ スタック計算機', shortName: 'スタック計算', icon: '📦',
      url: 'stack/', category: 'items',
      summary: 'アイテム数をスタック・チェスト・シュルカーボックス単位に換算。',
      versions: { java: 'yes', bedrock: 'unknown', note: '計算はJava版を基準にしています。' },
      keywords: ['スタック','チェスト','シュルカー','ダブルチェスト','換算','個数','stack'],
      related: ['circle', 'villager'],
      isPopular: true, isNew: false
    },
    {
      id: 'chunk', name: 'マイクラ チャンク計算機', shortName: 'チャンク計算', icon: '🧱',
      url: 'chunk/', category: 'coords',
      summary: '座標から、そのブロックがあるチャンクの境界とリージョンを調べられます。',
      versions: { java: 'yes', bedrock: 'partial', note: 'チャンク境界は共通ですが、リージョンはJava版の仕様です。' },
      keywords: ['チャンク','チャンク境界','リージョン','スポーンチャンク','chunk','region'],
      related: ['nether', 'distance', 'memo', 'circle'],
      isPopular: true, isNew: false
    },
    {
      id: 'distance', name: 'マイクラ距離計算機', shortName: '距離計算', icon: '📏',
      url: 'distance/', category: 'coords',
      summary: '2点の座標からブロック間の距離と、移動時間の目安を計算。',
      versions: { java: 'yes', bedrock: 'yes', note: '' },
      keywords: ['距離','2点間','移動時間','座標','distance'],
      related: ['nether', 'chunk', 'memo'],
      isPopular: false, isNew: false
    },
    {
      id: 'enchantment', name: 'マイクラ エンチャント一覧', shortName: 'エンチャント一覧', icon: '✨',
      url: 'enchantment/', category: 'enchant',
      summary: '全43種のエンチャントについて、付与できる対象・最大レベル・競合するエンチャントを確認。',
      versions: { java: 'yes', bedrock: 'yes', note: 'ページ内で統合版/Java版を切り替えられます。' },
      keywords: ['エンチャント','付与','魔法','最大レベル','競合','装備','修繕','enchant'],
      related: ['villager', 'stack'],
      isPopular: false, isNew: false
    },
    {
      id: 'memo', name: 'マイクラ 座標メモ', shortName: '座標メモ', icon: '📍',
      url: 'memo/', category: 'coords',
      summary: '拠点・村・ネザーゲートなどの座標を名前付きで保存。',
      versions: { java: 'yes', bedrock: 'yes', note: '' },
      keywords: ['座標','メモ','保存','拠点','村','ゲート','waypoint'],
      related: ['nether', 'distance', 'chunk'],
      isPopular: false, isNew: false
    },
    {
      id: 'villager', name: 'マイクラ 村人の取引一覧', shortName: '村人の取引', icon: '🏘',
      url: 'villager/', category: 'villager',
      summary: '職業別の取引内容を確認。アイテム名から取引を検索できます。',
      versions: { java: 'unknown', bedrock: 'yes', note: '統合版を基準に整理した一覧です。Java版とは内容が異なる場合があります。' },
      keywords: ['村人','取引','司書','職業','エメラルド','trade','villager'],
      related: ['enchantment', 'stack', 'memo'],
      isPopular: false, isNew: false
    }
  ]
};
