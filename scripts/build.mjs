// 使い方: リポジトリ直下で `node scripts/build.mjs`
// assets/tools-data.js から sitemap.xml と、index.html の構造化データ/noscript一覧を再生成します。
import fs from 'node:fs';
const src = fs.readFileSync('assets/tools-data.js', 'utf8');
const win = {}; new Function('window', src)(win);
const S = win.MC_SITE, base = S.baseUrl;
const cat = Object.fromEntries(S.categories.map(c => [c.id, c]));

// sitemap(lastmod は updated を書いたツールだけに付く。日付の水増しはしない)
const urls = [{ loc: base }].concat(S.tools.map(t => ({ loc: base + t.url, lastmod: t.updated })));
fs.writeFileSync('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') +
  '\n</urlset>\n');

// 構造化データ(ページ上に実在するツール一覧だけを書く)
const ld = [
  { '@context': 'https://schema.org', '@type': 'WebSite', name: S.name, url: base, inLanguage: 'ja' },
  { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Minecraft便利ツール集', url: base, inLanguage: 'ja',
    mainEntity: { '@type': 'ItemList', itemListElement: S.tools.map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.name, url: base + t.url })) } }
];
const jsonld = ld.map(o => '<script type="application/ld+json">' + JSON.stringify(o) + '</script>').join('\n');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const noscript = '<ul>\n' + S.tools.map(t =>
  `  <li><a href="${t.url}">${esc(t.name)}</a> - ${esc(t.summary)}</li>`).join('\n') + '\n</ul>';

let html = fs.readFileSync('index.html', 'utf8');
const swap = (name, body) => {
  const re = new RegExp(`(<!-- BUILD:${name}:START -->)[\\s\\S]*?(<!-- BUILD:${name}:END -->)`);
  if (!re.test(html)) throw new Error('marker not found: ' + name);
  html = html.replace(re, (_, a, b) => `${a}\n${body}\n${b}`);
};
swap('JSONLD', jsonld); swap('NOSCRIPT', noscript);
fs.writeFileSync('index.html', html);
console.log('OK:', S.tools.length, 'tools');
