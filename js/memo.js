// memo
const KEY='mc-tools-memo';
let memos=[];
try{memos=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){}
const saveMemos=()=>{try{localStorage.setItem(KEY,JSON.stringify(memos));return true}catch(e){$('mmsg').textContent='このブラウザでは保存できませんでした(この画面を閉じると消えます)。';return false}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DIM={o:'🌳 オーバーワールド',n:'🔥 ネザー',e:'🌌 エンド'};
function renderMemo(){
  const q=$('mq').value.trim().toLowerCase();
  const list=memos.filter(m=>!q||(m.name+' '+m.note).toLowerCase().includes(q));
  $('mlist').innerHTML=list.length?list.map(m=>{
    const y=m.y===null?'~':m.y;
    let conv='';
    if(m.d==='o')conv=`ネザーでは ${Math.floor(m.x/8)} ${y} ${Math.floor(m.z/8)}`;
    if(m.d==='n')conv=`オーバーワールドでは ${m.x*8} ${y} ${m.z*8}`;
    return `<div class="item"><div class="ih"><b>${esc(m.name)}</b><span class="tag">${DIM[m.d]}</span></div>
<div class="coord">${m.x} ${y} ${m.z}</div>${conv?`<div class="note">→ ${conv}</div>`:''}${m.note?`<div class="note">${esc(m.note)}</div>`:''}
<div class="acts"><button class="sm" data-a="c" data-id="${m.id}">コピー</button><button class="sm" data-a="t" data-id="${m.id}">/tpコピー</button><button class="sm" data-a="d" data-id="${m.id}">削除</button></div></div>`}).join(''):'<p class="note">'+(memos.length?'該当するメモがありません。':'メモはまだありません。')+'</p>';
}
$('madd').onclick=()=>{
  const x=n('mx'),y=n('my'),z=n('mz');
  if(x===null||z===null){$('mmsg').textContent='X と Z を入力してください。';return}
  memos.unshift({id:Date.now(),name:$('mn').value.trim()||'無題',d:$('md').value,x:Math.floor(x),y:y===null?null:Math.floor(y),z:Math.floor(z),note:$('mt').value.trim()});
  if(saveMemos())$('mmsg').textContent='保存しました。';
  ['mn','mx','my','mz','mt'].forEach(i=>$(i).value='');
  renderMemo();
};
$('mq').oninput=renderMemo;
$('mlist').onclick=e=>{
  const b=e.target.closest('button[data-a]');if(!b)return;
  const m=memos.find(v=>v.id==b.dataset.id);if(!m)return;
  if(b.dataset.a==='d'){memos=memos.filter(v=>v!==m);saveMemos();renderMemo()}
  else if(b.dataset.a==='c')copyText(m.y===null?`${m.x} ${m.z}`:`${m.x} ${m.y} ${m.z}`,b);
  else copyText(`/tp @s ${m.x} ${m.y===null?'~':m.y} ${m.z}`,b);
};
renderMemo();
