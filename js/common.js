const $=id=>document.getElementById(id);
const n=id=>{const v=$(id).value;return v===''||isNaN(+v)?null:+v};
const f=(v,d=1)=>Number.isFinite(v)?v.toLocaleString('ja-JP',{maximumFractionDigits:d}):'-';
const show=(el,rows)=>$(el).innerHTML=rows.map(r=>`<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');

// copy
async function copyText(t,btn){
  try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(_){}a.remove()}
  if(btn){const o=btn.textContent;btn.textContent='✔ コピー済み';setTimeout(()=>btn.textContent=o,1200)}
}
