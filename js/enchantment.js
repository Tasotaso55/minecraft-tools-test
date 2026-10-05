const IT={H:'ヘルメット',C:'チェストプレート',L:'レギンス',B:'ブーツ',E:'エリトラ',SH:'盾',SW:'剣',SP:'槍',AX:'斧',MC:'メイス',BW:'弓',CB:'クロスボウ',TR:'トライデント',PK:'ツルハシ',SV:'シャベル',HO:'クワ',FR:'釣竿',SR:'ハサミ',FS:'火打石と打ち金',CS:'ニンジン付きの棒',WS:'歪んだキノコ付きの棒',BR:'ブラシ',CP:'コンパス',PU:'くり抜かれたカボチャ',HD:'Mobの頭'};
const IG=[['防具','H C L B E SH'],['武器','SW SP AX MC BW CB TR'],['道具','PK SV HO FR SR FS CS WS BR CP'],['その他','PU HD']];
const CATS={all:'すべて',a:'防具',w:'剣・槍・斧',t:'ツール',b:'弓',c:'クロスボウ',r:'トライデント',m:'メイス',f:'釣竿',g:'全般・呪い'};
const E=(n,en,m,cat,t,a,conf,o)=>Object.assign({n,en,m,cat,t,a,conf:conf||''},o||{});
const DUR='H C L B SW SP AX PK SV HO BW CB TR MC FR';
const ENCH=[
E('耐久力','Unbreaking',3,'g',DUR,'SR FS SH CS WS E BR'),
E('修繕','Mending',1,'g','',DUR+' SR FS SH CS WS E BR','無限',{tr:1}),
E('消滅の呪い','Curse of Vanishing',1,'g','','H C L B E SH SW SP AX MC BW CB TR PK SV HO FR SR FS CP CS WS BR PU HD','',{tr:1}),
E('束縛の呪い','Curse of Binding',1,'g','','H C L B E PU HD','',{tr:1}),
E('ダメージ軽減','Protection',4,'a','H C L B','','火炎耐性・爆発耐性・飛び道具耐性'),
E('火炎耐性','Fire Protection',4,'a','H C L B','','ダメージ軽減・爆発耐性・飛び道具耐性'),
E('爆発耐性','Blast Protection',4,'a','H C L B','','ダメージ軽減・火炎耐性・飛び道具耐性'),
E('飛び道具耐性','Projectile Protection',4,'a','H C L B','','ダメージ軽減・火炎耐性・爆発耐性'),
E('落下耐性','Feather Falling',4,'a','B',''),
E('水中呼吸','Respiration',3,'a','H',''),
E('水中採掘','Aqua Affinity',1,'a','H',''),
E('棘の鎧','Thorns',3,'a','C','H L B','',{be:{t:'H C L B',a:''}}),
E('水中歩行','Depth Strider',3,'a','B','','氷渡り'),
E('氷渡り','Frost Walker',2,'a','','B','水中歩行',{tr:1}),
E('ソウルスピード','Soul Speed',3,'a','','B','',{tr:1}),
E('スニーク速度上昇','Swift Sneak',3,'a','','L','',{tr:1}),
E('ダメージ増加','Sharpness',5,'w','SW SP','','アンデッド特効・虫特効',{be:{t:'SW SP AX'},je:{a:'AX'}}),
E('アンデッド特効','Smite',5,'w','SW SP','','ダメージ増加・虫特効(メイスは重撃・防具貫通とも)',{be:{t:'SW SP AX MC'},je:{a:'AX MC'}}),
E('虫特効','Bane of Arthropods',5,'w','SW SP','','ダメージ増加・アンデッド特効(メイスは重撃・防具貫通とも)',{be:{t:'SW SP AX MC'},je:{a:'AX MC'}}),
E('ノックバック','Knockback',2,'w','SW SP',''),
E('火属性','Fire Aspect',2,'w','SW SP','','',{be:{t:'SW SP MC'},je:{a:'MC'}}),
E('ドロップ増加','Looting',3,'w','SW SP',''),
E('範囲ダメージ増加','Sweeping Edge',3,'w','SW','','',{jeOnly:1}),
E('ランジ','Lunge',3,'w','SP','','',{b:'突進'}),
E('効率強化','Efficiency',5,'t','PK SV AX HO','SR'),
E('シルクタッチ','Silk Touch',1,'t','PK SV AX HO','','幸運',{be:{a:'SR'}}),
E('幸運','Fortune',3,'t','PK SV AX HO','','シルクタッチ'),
E('射撃ダメージ増加','Power',5,'b','BW',''),
E('パンチ','Punch',2,'b','BW',''),
E('フレイム','Flame',1,'b','BW',''),
E('無限','Infinity',1,'b','BW','','修繕'),
E('高速装填','Quick Charge',3,'c','CB',''),
E('貫通','Piercing',4,'c','CB','','拡散'),
E('拡散','Multishot',1,'c','CB','','貫通'),
E('忠誠','Loyalty',3,'r','TR','','激流'),
E('激流','Riptide',3,'r','TR','','忠誠・召雷'),
E('召雷','Channeling',1,'r','TR','','激流'),
E('水生特効','Impaling',5,'r','TR',''),
E('重撃','Density',5,'m','MC','','アンデッド特効・虫特効・防具貫通(違反)',{b:'密度'}),
E('防具貫通','Breach',4,'m','MC','','アンデッド特効・虫特効・重撃(密度)',{b:'違反'}),
E('ウィンドバースト','Wind Burst',3,'m','','MC','',{b:'爆風'}),
E('宝釣り','Luck of the Sea',3,'f','FR',''),
E('入れ食い','Lure',3,'f','FR','')
];
(function(){
let ed='be',view='e',cat='all';
const RM=['','I','II','III','IV','V'];
const g=id=>document.getElementById(id);
const val=(e,k)=>{const o=ed==='be'?e.be:e.je;return o&&o[k]!==undefined?o[k]:e[k]};
const nm=e=>ed==='be'&&e.b?e.b:e.n;
const lst=s=>s?s.split(' '):[];
const list=()=>ENCH.filter(e=>!(e.jeOnly&&ed==='be'));
const chips=(arr)=>arr.map(x=>`<span class="tag">${IT[x]}</span>`).join('');
function renderE(){
  const k=g('eq').value.trim().toLowerCase();
  const rows=list().filter(e=>(cat==='all'||e.cat===cat)&&(!k||(e.n+(e.b||'')+e.en).toLowerCase().includes(k)));
  g('elist').innerHTML=rows.length?rows.map(e=>{
    const t=lst(val(e,'t')),a=lst(val(e,'a'));
    return `<div class="item" style="margin:0"><div class="ih"><b>${nm(e)} <span class="en">${e.en}</span></b>${e.tr?'<span class="tag tr">宝</span>':''}</div>
<div class="note" style="margin-top:2px">最大レベル:<b style="color:var(--ac2)">${RM[e.m]}</b></div>
${t.length?`<div class="note" style="margin-top:4px">エンチャントテーブル:</div><div class="chips vc">${chips(t)}</div>`:''}
${a.length?`<div class="note" style="margin-top:4px">金床のみ:</div><div class="chips vc">${chips(a)}</div>`:''}
${e.conf?`<div class="note" style="margin-top:4px">競合:${e.conf}</div>`:''}</div>`}).join(''):'<p class="note">該当なし</p>';
  g('ecnt').textContent=`この版のエンチャント:全${list().length}種(表示${rows.length}種)`;
}
function renderI(){
  const it=g('eitem').value;
  const rows=list().map(e=>({e,t:lst(val(e,'t')).includes(it),a:lst(val(e,'a')).includes(it)})).filter(r=>r.t||r.a).sort((x,y)=>(y.t-x.t));
  g('icnt').textContent=`${IT[it]}に付けられるエンチャント:${rows.length}種`;
  g('ilist').innerHTML=rows.map(r=>`<div class="item" style="margin:0"><div class="ih"><b>${nm(r.e)} <span class="en">${r.e.en}</span></b><span class="tag${r.t?'':' tr'}">${r.t?'テーブル可':'金床のみ'}</span></div>
<div class="note" style="margin-top:2px">最大レベル:<b style="color:var(--ac2)">${RM[r.e.m]}</b>${r.e.tr?' ・ 宝':''}</div>${r.e.conf?`<div class="note" style="margin-top:2px">競合:${r.e.conf}</div>`:''}</div>`).join('');
  g('ecnt').textContent=`この版のエンチャント:全${list().length}種`;
}
function render(){g('pe').style.display=view==='e'?'':'none';g('pi').style.display=view==='i'?'':'none';view==='e'?renderE():renderI()}
Object.keys(CATS).forEach(k=>{const b=document.createElement('button');b.className='sm'+(k==='all'?' on':'');b.textContent=CATS[k];
  b.onclick=()=>{cat=k;[...g('echips').children].forEach(c=>c.classList.remove('on'));b.classList.add('on');renderE()};g('echips').appendChild(b)});
g('eitem').innerHTML=IG.map(([n,s])=>`<optgroup label="${n}">${s.split(' ').map(c=>`<option value="${c}">${IT[c]}</option>`).join('')}</optgroup>`).join('');
g('eq').addEventListener('input',renderE);
g('eed').addEventListener('change',()=>{ed=g('eed').value;render()});
g('evw').addEventListener('change',()=>{view=g('evw').value;render()});
g('eitem').addEventListener('change',renderI);
render();
})();
