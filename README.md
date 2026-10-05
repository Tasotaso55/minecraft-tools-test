# マイクラ便利ツール集 ポータル化パッチ

既存の各ツールページ(`circle/` `nether/` ほか)・URL・機能には**一切触れません**。
追加・置き換えするのは下記のファイルだけです。

| ファイル | 内容 |
|---|---|
| `index.html` | ホームページ(**既存の index.html を置き換え**。元ファイルは事前にバックアップ) |
| `assets/tools-data.js` | ツール情報の一元管理(name / url / summary / category / versions / keywords / related / isPopular / isNew) |
| `assets/portal.css`, `assets/portal.js` | ホーム専用のCSS/JS(クラス名は `tool-` `chip` 等。既存CSSと衝突しないか確認してください) |
| `favicon.svg` | ファビコン |
| `sitemap.xml`, `robots.txt` | `scripts/build.mjs` で再生成可能 |
| `scripts/build.mjs` | sitemap・JSON-LD・noscript一覧を `tools-data.js` から再生成 |

> 既存の `sitemap.xml` / `robots.txt` / `assets/` と名前が重なる場合は、上書きせず内容を比較してください。
> 注意: GitHub Pages のプロジェクトサイト(`/minecraft-tools/`)では、`robots.txt` はホスト直下にないため検索エンジンに読まれません(害はありません)。**sitemap は Search Console から直接送信**してください。

## 反映手順
1. 上記ファイルをリポジトリ直下にコピー → commit → push
2. 数分後に `https://tasotaso55.github.io/minecraft-tools/` を開き、検索・カテゴリー・カードのリンクを確認
3. Search Console で `sitemap.xml` を送信し、トップを「URL検査」→インデックス登録をリクエスト

## ツールを追加するとき
1. `circle/` と同様に新しいフォルダでツールページを作る
2. `assets/tools-data.js` の `tools` に1件追記(`isNew: true`, `added: 'YYYY-MM-DD'`)
3. `node scripts/build.mjs` を実行 → sitemap / JSON-LD / noscript が更新される
4. 関連するツールの `related` にも追加し、各ページの「ほかのツール」を更新

人気ツールは `isPopular` を手動で切り替えます。将来アクセス数で決める場合も、このフラグを書き換えるだけで済みます。

## ⚠ 要確認: Java版 / 統合版の表示
私は各ツールの中身(ソース)を確認できず、公開ページの表示内容と仕様の性質から判断しています。
**`versions` はご自身で確認して修正してください。** 未確認のものは `unknown`(画面では「？」)にしてあります。

| ツール | Java | 統合版 | 根拠 |
|---|---|---|---|
| 円・球 / ネザー座標 / 距離 / 座標メモ | ○ | ○ | 版に依存しない計算 |
| チャンク | ○ | △ | リージョンはJava版の仕様 |
| スタック / エンチャント / 村人 | ○ | ？ | 統合版で差異の可能性。要確認 |

## 各ツールページに足す小さな変更(任意・既存本文は削除しない)
今回は各ツールのHTMLが見えないため、自動書き換えはしていません。以下を手動で追加してください。

**1. パンくずを「トップ → カテゴリー → ツール」に**(カテゴリーは `../#cat-coords` のようなリンクで、ホームの絞り込み表示が開きます)
```html
<ol class="breadcrumb">
  <li><a href="../">トップ</a></li>
  <li><a href="../#cat-coords">座標・探索</a></li>
  <li aria-current="page">ネザー座標計算</li>
</ol>
```
カテゴリーID: `build` / `coords` / `items` / `enchant` / `villager`

**2. パンくずのJSON-LD**(ページ上に同じパンくずがある場合のみ)
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"トップ","item":"https://tasotaso55.github.io/minecraft-tools/"},
 {"@type":"ListItem","position":2,"name":"座標・探索","item":"https://tasotaso55.github.io/minecraft-tools/#cat-coords"},
 {"@type":"ListItem","position":3,"name":"ネザー座標計算","item":"https://tasotaso55.github.io/minecraft-tools/nether/"}]}
</script>
```
FAQPage のJSON-LDは、ページ上のFAQ文と**完全に同じ内容**のときだけ追加してください(`circle` と `nether` には既に3問ずつFAQがあります)。

**3. 「ほかのツール」の推奨(3〜5件)** … `tools-data.js` の `related` と同じ内容です
| ページ | 推奨 |
|---|---|
| circle | stack, memo, chunk, distance |
| nether | memo, distance, chunk |
| stack | circle, villager |
| chunk | nether, distance, memo, circle |
| distance | nether, chunk, memo |
| enchantment | villager, stack |
| memo | nether, distance, chunk |
| villager | enchantment, stack, memo |

**4. 全ページ共通の確認**: `<link rel="canonical">`、`<link rel="icon" href="../favicon.svg">`、OGP(`og:title/description/url`)、titleが全ページで重複しないこと。

## circle/ に追加できる解説ブロック(既存FAQの下に追加。文面は調整してください)
```html
<h2>マイクラで円・球・ドームを作る手順</h2>
<p>円形の建築は、先に「どのブロックを置くか」を平面図で決めておくと迷いません。このツールで直径を入力し、上から見た配置図を見ながら、中心線を基準に1行ずつ置いていきます。</p>
<h3>円形の建物・塔を作るには</h3>
<p>「円」を選び、直径を入れます。外壁だけなら「外周のみ」、床や広場なら「塗りつぶし」を選びます。必要ブロック数も表示されるので、素材集めの目安にできます。</p>
<h3>球・ドームを作るには</h3>
<p>「球」または「ドーム」を選び、◀▶で層を切り替えながら下の層から順に積みます。「全層を並べて表示」で全体の形を確認でき、「画像として保存」で建築中に見返せます。</p>
<h3>楕円形にしたいときは</h3>
<p>「楕円」を選び、幅(X方向)と奥行き(Z方向)を別々に入力します。</p>
```
(記載内容は現在のページの機能説明のみで、存在しない機能は書いていません。)

## 公開前チェックリスト
- [ ] 全8ツールのURLが開く / 各ツールが動く
- [ ] ホームで検索(例: ネザー・円・座標・ドーム)とカテゴリー絞り込みが動く
- [ ] スマホ幅(360px)で横スクロールが出ない
- [ ] ブラウザのコンソールにエラーがない
- [ ] 全ページの title が重複していない
- [ ] Java/統合版の表示を確認・修正した
- [ ] (任意)OGP画像 `og:image` 用に 1200×630 の画像を用意して追記
