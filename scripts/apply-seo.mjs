// 使い方(リポジトリ直下で):
//   node scripts/apply-seo.mjs --dry     # 変更せず、反映できるか確認だけ
//   node scripts/apply-seo.mjs           # 反映(何度実行しても二重にならない)
// 既存HTMLは「head への追記/置換」と「『ほかのマイクラツール』の直前に解説ブロックを挿入」だけ変更します。
import fs from 'node:fs';
const DRY = process.argv.includes('--dry');
const bi = process.argv.indexOf('--base');
const BASE = bi > -1 ? process.argv[bi + 1] : 'https://tasotaso55.github.io/minecraft-tools/';

// title/desc が null のページは既存のまま(エンチャントは既存が良いので維持)
const PAGES = {
  circle: { name: '円・球生成器',
    title: 'マイクラ円・球・ドームの作り方｜ブロック配置ジェネレーター',
    desc: 'マイクラで円・楕円・球・ドームを作るためのブロック配置ツール。直径を入れると上から見た図と層ごとの配置、必要ブロック数が分かります。円形建築の作り方や直径別の目安も解説。',
    next: [['stack', '必要ブロック数をスタックに換算'], ['memo', '建築場所の座標を保存'], ['chunk', '建築場所のチャンクを確認']] },
  nether: { name: 'ネザー座標計算',
    title: 'マイクラ ネザー座標計算機｜8倍の座標変換とゲートの位置合わせ',
    desc: 'オーバーワールドとネザーの座標を相互に変換できる無料ツール。X・Zを8で割る/8倍にする計算方法、ネザーゲートの位置合わせ、座標がずれる原因も解説。',
    next: [['distance', '移動距離と時間を比べる'], ['memo', 'ゲートの座標を保存'], ['chunk', '座標のチャンクを確認']] },
  stack: { name: 'スタック計算',
    title: 'マイクラ スタック計算機｜何スタック・チェスト何個分かを計算',
    desc: 'アイテム数を、スタック数・チェスト・ラージチェスト・シュルカーボックスに換算する無料ツール。64個・16個・1個の違いと各容量の一覧、計算例も掲載。',
    next: [['circle', '建築に必要なブロック数を調べる'], ['villager', '取引に使うアイテムを調べる'], ['distance', '素材集めの移動距離を計算']] },
  chunk: { name: 'チャンク計算',
    title: null,
    desc: 'マイクラの座標からチャンク座標、チャンク内の位置、チャンク境界、リージョンファイル名を調べられる無料ツール。チャンクとは何か、計算方法も解説。',
    next: [['nether', 'ネザーの座標に変換する'], ['distance', '2点間の距離を計算'], ['memo', 'チャンクの座標を保存']] },
  distance: { name: '距離計算',
    title: 'マイクラ 距離計算機｜座標2点間の距離と移動時間',
    desc: 'マイクラの2つの座標間の直線距離・水平距離・マンハッタン距離と、歩き・ダッシュ・ボートの移動時間の目安を計算できる無料ツール。距離の計算式と具体例も解説。',
    next: [['nether', 'ネザー経由の座標を計算'], ['memo', '拠点の座標を保存'], ['chunk', '座標のチャンクを確認']] },
  enchantment: { name: 'エンチャント一覧', title: null, desc: null,
    next: [['villager', 'エンチャントの本の取引先を探す'], ['stack', '持ち運ぶ数をスタックで確認']] },
  memo: { name: '座標メモ',
    title: 'マイクラ座標メモ｜拠点・村・ネザーゲートを保存',
    desc: 'マイクラの拠点・村・ネザーゲート・エンドポータル・トラップなどの座標を名前付きで保存できる無料メモ。ネザー座標への換算や /tp コマンドのコピーにも対応。',
    next: [['nether', 'ネザーの対応座標を計算'], ['distance', '拠点間の距離を計算'], ['chunk', '座標のチャンクを確認']] },
  villager: { name: '村人の取引',
    title: 'マイクラ 村人の取引一覧｜欲しいアイテムから職業を検索',
    desc: null,
    next: [['enchantment', '本のエンチャントを確認'], ['stack', 'エメラルドの数をスタックで確認'], ['memo', '村の座標を保存']] }
};
const LABEL = { circle: '円・球生成器', nether: 'ネザー座標計算', stack: 'スタック計算', chunk: 'チャンク計算',
  distance: '距離計算', enchantment: 'エンチャント一覧', memo: '座標メモ', villager: '村人の取引' };

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const rmBlock = (h, k) => h.replace(new RegExp(`\\s*<!-- ${k}:START -->[\\s\\S]*?<!-- ${k}:END -->`, 'g'), '');
function setTag(h, re, tag) { return re.test(h) ? h.replace(re, tag) : h.replace('</head>', `${tag}\n</head>`); }
const setMeta = (h, attr, key, val) =>
  setTag(h, new RegExp(`<meta\\s+[^>]*${attr}=["']${key}["'][^>]*>`, 'i'), `<meta ${attr}="${key}" content="${esc(val)}">`);

let fail = 0;
for (const [slug, p] of Object.entries(PAGES)) {
  const file = `${slug}/index.html`;
  if (!fs.existsSync(file)) { console.log(`SKIP ${file} (なし)`); fail++; continue; }
  let h = fs.readFileSync(file, 'utf8');
  const frag = fs.readFileSync(`content/${slug}.html`, 'utf8').trim();
  const url = `${BASE}${slug}/`;
  h = rmBlock(rmBlock(h, 'SEO-HEAD'), 'SEO-GUIDE');

  // 1) 挿入位置の確認(見つからなければこのページは触らない)
  const at = h.search(/<h2[^>]*>\s*ほかのマイクラツール/);
  if (at < 0) { console.log(`NG   ${file}: 「ほかのマイクラツール」見出しが見つかりません。手動で挿入してください`); fail++; continue; }
  const open = Math.max(h.lastIndexOf('<section', at), h.lastIndexOf('<aside', at));
  const sameBlock = open > -1 && !h.slice(open, at).includes('</section>') && !h.slice(open, at).includes('</aside>');
  const pos = sameBlock ? open : at;

  // 2) head
  if (p.title) { h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`); h = setMeta(h, 'property', 'og:title', p.title); }
  if (p.desc) { h = setMeta(h, 'name', 'description', p.desc); h = setMeta(h, 'property', 'og:description', p.desc); }
  h = setTag(h, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${url}">`);
  h = setMeta(h, 'property', 'og:url', url);
  h = setMeta(h, 'property', 'og:type', 'website');
  h = setMeta(h, 'property', 'og:locale', 'ja_JP');
  h = setMeta(h, 'property', 'og:site_name', 'マイクラ便利ツール集');
  h = setMeta(h, 'name', 'twitter:card', 'summary');
  const title = p.title || (h.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
  const desc = p.desc || ((h.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [, ''])[1]);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: BASE },
      { '@type': 'ListItem', position: 2, name: p.name, item: url }] },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, url, description: desc, inLanguage: 'ja',
      applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web browser', isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' } }
  ].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  h = h.replace('</head>', `<!-- SEO-HEAD:START -->\n<link rel="stylesheet" href="../assets/guide.css">\n${ld}\n<!-- SEO-HEAD:END -->\n</head>`);

  // 3) 本文(pos は head 変更で位置がずれるので再計算)
  const at2 = h.search(/<h2[^>]*>\s*ほかのマイクラツール/);
  const open2 = Math.max(h.lastIndexOf('<section', at2), h.lastIndexOf('<aside', at2));
  const same2 = open2 > -1 && !h.slice(open2, at2).includes('</section>') && !h.slice(open2, at2).includes('</aside>');
  const ins = same2 ? open2 : at2;
  const next = `<h2 id="next">このあとに使いたいツール</h2>\n<ul class="g-next">\n` +
    p.next.map(([s, why]) => `<li><a href="../${s}/">${LABEL[s]}(${why})</a></li>`).join('\n') + '\n</ul>';
  const block = `<!-- SEO-GUIDE:START -->\n<div class="g-guide">\n${frag}\n${next}\n</div>\n<!-- SEO-GUIDE:END -->\n`;
  h = h.slice(0, ins) + block + h.slice(ins);
  console.log(`${DRY ? 'DRY ' : 'OK  '} ${file}`);
  if (!DRY) fs.writeFileSync(file, h);
}
if (fail) { console.log(`\n${fail}ページは反映できませんでした(上記参照)`); process.exitCode = 1; }
