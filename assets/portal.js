/* ホームページ用: カード表示・検索・カテゴリー絞り込み(データは tools-data.js から) */
(function () {
  'use strict';
  var S = window.MC_SITE, T = S.tools, C = S.categories, catById = {};
  C.forEach(function (c) { catById[c.id] = c; });
  var state = { q: '', cat: 'all' };
  var $q = document.getElementById('tool-search');
  var $chips = document.getElementById('cat-filter');
  var $out = document.getElementById('results');
  var $status = document.getElementById('result-status');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // 全角半角・大文字小文字・カタカナ/ひらがなの差を吸収
  function norm(s) {
    return String(s).normalize('NFKC').toLowerCase().replace(/[\u30a1-\u30f6]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0x60);
    });
  }
  var index = T.map(function (t) {
    var c = catById[t.category];
    return norm([t.name, t.shortName, t.summary, c ? c.name : '', (t.keywords || []).join(' ')].join(' '));
  });

  function badge(label, st, title) {
    return '<span class="badge badge-' + st + '" title="' + esc(title) + '">' + label + '</span>';
  }
  function versionBadges(t) {
    var v = t.versions || {}, sym = { yes: '○', partial: '△', unknown: '？' };
    var txt = { yes: '対応', partial: '一部のみ対応', unknown: '未確認' };
    var j = v.java || 'unknown', b = v.bedrock || 'unknown';
    return badge('Java版 ' + sym[j], j, 'Java版: ' + txt[j]) +
           badge('統合版 ' + sym[b], b, '統合版: ' + txt[b] + (v.note ? '(' + v.note + ')' : ''));
  }
  function card(t) {
    var c = catById[t.category];
    return '<a class="tool-card" href="' + esc(t.url) + '"><span class="tool-icon" aria-hidden="true">' + t.icon +
      '</span><span class="tool-body"><strong>' + esc(t.name) + '</strong><span class="tool-sum">' + esc(t.summary) +
      '</span><span class="tool-meta">' + (t.isNew ? '<span class="flag">NEW</span>' : '') +
      (c ? '<span class="cat-label">' + esc(c.name) + '</span>' : '') + versionBadges(t) + '</span></span></a>';
  }
  function block(id, tag, title, lead, list) {
    if (!list.length) return '';
    return '<section class="block" id="' + id + '"><' + tag + '>' + esc(title) + '</' + tag + '>' +
      (lead ? '<p class="lead">' + esc(lead) + '</p>' : '') +
      '<div class="grid">' + list.map(card).join('') + '</div></section>';
  }
  function byCat(id) { return T.filter(function (t) { return t.category === id; }); }

  function render() {
    var q = norm(state.q).trim(), terms = q ? q.split(/\s+/) : [], html = '', n = 0;
    if (terms.length) {
      var hit = T.filter(function (t, i) {
        return terms.every(function (w) { return index[i].indexOf(w) !== -1; }) &&
               (state.cat === 'all' || t.category === state.cat);
      });
      n = hit.length;
      html = n ? '<div class="grid">' + hit.map(card).join('') + '</div>'
        : '<p class="empty">「' + esc(state.q) + '」に合うツールが見つかりませんでした。「ネザー」「円」「座標」など短い言葉で試すか、上のカテゴリーから探してください。</p>';
      $status.textContent = n ? n + '件のツールが見つかりました' : '該当するツールはありません';
    } else if (state.cat !== 'all') {
      var c = catById[state.cat], list = byCat(state.cat);
      n = list.length;
      html = block('cat-' + c.id, 'h2', c.icon + ' ' + c.name, c.desc, list);
      $status.textContent = c.name + ': ' + n + '件';
    } else {
      var pop = T.filter(function (t) { return t.isPopular; });
      var nw = T.filter(function (t) { return t.isNew; }).sort(function (a, b) { return String(b.added || '').localeCompare(String(a.added || '')); });
      html = block('popular', 'h2', '🔥 人気のMinecraftツール', '特によく使われる、定番のツールです。', pop) +
             block('new', 'h2', '🆕 新着ツール', '最近追加したツールです。', nw);
      var cats = C.map(function (c) { return block('cat-' + c.id, 'h3', c.icon + ' ' + c.name, c.desc, byCat(c.id)); }).join('');
      html += '<section class="block" id="categories"><h2>カテゴリー別のツール</h2></section>' + cats;
      $status.textContent = '全' + T.length + '件のツール';
    }
    $out.innerHTML = html;
  }

  function renderChips() {
    var items = [{ id: 'all', label: 'すべて' }].concat(C.map(function (c) { return { id: c.id, label: c.icon + ' ' + c.name }; }));
    $chips.innerHTML = items.map(function (it) {
      return '<li><button type="button" class="chip" data-cat="' + it.id + '" aria-pressed="' + (state.cat === it.id) + '">' + esc(it.label) + '</button></li>';
    }).join('');
  }
  $chips.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-cat]');
    if (!b) return;
    state.cat = b.getAttribute('data-cat');
    renderChips(); render();
  });
  $q.addEventListener('input', function () { state.q = $q.value; render(); });

  function fromHash() { // 例: /#cat-coords (各ツールページのパンくずから来た場合)
    var m = /^#cat-([a-z]+)$/.exec(location.hash);
    if (m && catById[m[1]]) { state.cat = m[1]; renderChips(); render(); $out.scrollIntoView(); }
  }
  var p = new URLSearchParams(location.search).get('q');
  if (p) { state.q = p; $q.value = p; }
  renderChips(); render(); fromHash();
  window.addEventListener('hashchange', fromHash);
})();
