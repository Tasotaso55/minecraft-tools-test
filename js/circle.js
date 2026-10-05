// circle / sphere / dome
(function(){
const g=id=>document.getElementById(id);
const NAMES={circle:'円',ellipse:'楕円',sphere:'球',dome:'ドーム'};
const cv=g('cs-cv'),ctx=cv.getContext('2d');
let data=null;
function cols(){const s=getComputedStyle(document.documentElement),v=k=>s.getPropertyValue(k).trim();return{bg:v('--card')||'#fff',tx:v('--text')||'#222',sub:v('--sub')||'#666',ln:v('--line')||'#ddd',ac:v('--ac')||'#3f8f3a',ac2:v('--ac2')||'#b8341f'}}
function build(sh,W,D){
  const is3=sh==='sphere'||sh==='dome';
  const cx=(W-1)/2,cz=(D-1)/2,cy=(W-1)/2;
  const k0=sh==='dome'?Math.ceil(cy-1e-9):0;
  const L=is3?W-k0:1;
  const F=[];
  for(let l=0;l<L;l++){const k=k0+l,lay=[];
    for(let j=0;j<D;j++){const row=[];
      for(let i=0;i<W;i++){const dx=(i-cx)/(W/2),dz=(j-cz)/(D/2),dy=is3?(k-cy)/(W/2):0;row.push(dx*dx+dz*dz+dy*dy<=1+1e-9)}
      lay.push(row)}
    F.push(lay)}
  const nb=(l,j,i)=>{if(j<0||j>=D||i<0||i>=W)return false;if(l<0)return sh==='dome'||!is3;if(l>=L)return !is3;return F[l][j][i]};
  const O=F.map((lay,l)=>lay.map((row,j)=>row.map((c,i)=>c&&!(nb(l,j,i-1)&&nb(l,j,i+1)&&nb(l,j-1,i)&&nb(l,j+1,i)&&(!is3||(nb(l-1,j,i)&&nb(l+1,j,i)))))));
  return{F,O,L,is3};
}
function grid(cells,W,D,x0,y0,cs,c,labels){
  for(let j=0;j<D;j++)for(let i=0;i<W;i++){
    const x=x0+i*cs,y=y0+j*cs,on=cells[j][i];
    if(on){ctx.fillStyle=c.ac;ctx.fillRect(x,y,cs,cs)}
    ctx.strokeStyle=on?'rgba(0,0,0,.3)':c.ln;ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,cs,cs)}
  ctx.save();ctx.setLineDash([4,3]);ctx.strokeStyle=c.ac2;ctx.lineWidth=1.5;ctx.beginPath();
  ctx.moveTo(x0+W*cs/2,y0-3);ctx.lineTo(x0+W*cs/2,y0+D*cs+3);ctx.moveTo(x0-3,y0+D*cs/2);ctx.lineTo(x0+W*cs+3,y0+D*cs/2);ctx.stroke();ctx.restore();
  if(labels){const st=cs>=18?1:cs>=11?2:5;ctx.fillStyle=c.sub;ctx.font=Math.min(11,cs)+'px sans-serif';ctx.textBaseline='middle';
    ctx.textAlign='center';for(let i=0;i<W;i++)if(i%st===0||i===W-1)ctx.fillText(i+1,x0+i*cs+cs/2,y0-9);
    ctx.textAlign='right';for(let j=0;j<D;j++)if(j%st===0||j===D-1)ctx.fillText(j+1,x0-6,y0+j*cs+cs/2)}
}
function size(w,h){let sc=Math.min(2,window.devicePixelRatio||1);while(w*h*sc*sc>1.2e7&&sc>1)sc=Math.max(1,sc-.25);
  cv.width=Math.round(w*sc);cv.height=Math.round(h*sc);cv.style.width=w+'px';ctx.setTransform(sc,0,0,sc,0,0);
  ctx.fillStyle=cols().bg;ctx.fillRect(0,0,w,h)}
const FONT='system-ui,"Hiragino Sans","Yu Gothic",sans-serif';
function rowsText(cells,W,D){
  const out=['(横=X 左→右、縦=Z 上→下 / 空=置かない、置=ブロックを置く)'];
  for(let j=0;j<D;j++){const seg=[];let cur=cells[j][0],run=0;
    for(let i=0;i<W;i++){if(cells[j][i]===cur)run++;else{seg.push((cur?'置':'空')+run);cur=cells[j][i];run=1}}
    seg.push((cur?'置':'空')+run);out.push(String(j+1).padStart(3)+'行: '+seg.join(' '))}
  return out.join('\n');
}
function clear(){data=null;size(1,1);g('cs-out').innerHTML='';g('cs-txt').textContent='';g('cs-lay').style.display='none'}
function update(reset){
  const sh=g('cs-shape').value,is3=sh==='sphere'||sh==='dome',max=is3?64:128;
  g('cs-dw').style.display=sh==='ellipse'?'':'none';
  g('cs-wl').textContent=sh==='ellipse'?'幅(X方向)':sh==='dome'?'直径(高さは約半分)':'直径';
  let w=parseInt(g('cs-w').value,10),d=parseInt(g('cs-d').value,10);
  if(!(w>=1)){clear();return}
  if(w>max){w=max;g('cs-w').value=max}
  if(sh==='ellipse'){if(!(d>=1)){clear();return}if(d>max){d=max;g('cs-d').value=max}}else d=w;
  const b=build(sh,w,d),cells=g('cs-mode').value==='outline'?b.O:b.F,c=cols();
  const counts=cells.map(lay=>lay.reduce((a,r)=>a+r.filter(Boolean).length,0)),total=counts.reduce((a,v)=>a+v,0);
  const rng=g('cs-rng');
  g('cs-lay').style.display=is3?'':'none';
  if(is3){rng.max=b.L;if(reset)rng.value=sh==='sphere'?Math.ceil(b.L/2):1;if(+rng.value>b.L)rng.value=b.L}
  const l=is3?(+rng.value||1)-1:0,all=is3&&g('cs-all').checked;
  g('cs-ln').textContent=is3?`下から ${l+1} 層目 / 全 ${b.L} 層 ・ この層 ${counts[l]} 個`:'';
  const title=`${NAMES[sh]} ${sh==='ellipse'?w+'×'+d:'直径'+w} ${g('cs-mode').value==='outline'?'外周のみ':'塗りつぶし'} ・ 合計 ${total} 個`;
  const hd=34,pad=12;
  if(!all){
    const hd2=is3?48:34,cs=Math.max(6,Math.min(30,Math.floor(520/Math.max(w,d)))),lw=28,tw=pad*2+lw+w*cs,th=hd2+16+d*cs+pad;
    size(Math.max(tw,300),th);
    ctx.fillStyle=c.tx;ctx.font='bold 14px '+FONT;ctx.textAlign='left';ctx.textBaseline='alphabetic';
    ctx.fillText(title,pad,22);if(is3){ctx.font='13px '+FONT;ctx.fillText(`下から ${l+1} 層目(${counts[l]}個)`,pad,42)}
    grid(cells[l],w,d,pad+lw,hd2+16,cs,c,true);
  }else{
    const cs=Math.max(3,Math.min(12,Math.floor(300/Math.max(w,d)))),gap=16,tw=w*cs,cw=880,n=Math.max(1,Math.floor((cw-pad*2+gap)/(tw+gap))),rows=Math.ceil(b.L/n);
    const th=hd+pad+rows*(d*cs+gap+18);
    size(cw,th);
    ctx.fillStyle=c.tx;ctx.font='bold 14px '+FONT;ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText(title,pad,22);
    for(let k=0;k<b.L;k++){const x=pad+(k%n)*(tw+gap),y=hd+Math.floor(k/n)*(d*cs+gap+18);
      ctx.fillStyle=c.tx;ctx.font='12px '+FONT;ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText(`${k+1}層目 (${counts[k]}個)`,x,y+12);
      grid(cells[k],w,d,x,y+18,cs,c,false)}
  }
  data={title};
  const st=Math.floor(total/64),rem=total%64;
  show('cs-out',[['必要ブロック数(合計)',f(total,0)+' 個'],['スタック換算',`${f(st,0)} スタック + ${rem} 個`],['シュルカーボックス',f(total/1728,2)+' 箱分'],
    ['大きさ',is3?`${w} × ${w} × ${b.L}(高さ)`:`${w} × ${d}`],...(is3?[['この層のブロック数',f(counts[l],0)+' 個']]:[])]);
  g('cs-txt').textContent=(is3?`下から ${l+1} 層目\n`:'')+rowsText(cells[l],w,d);
}
['cs-shape','cs-w','cs-d'].forEach(i=>g(i).addEventListener('input',()=>update(true)));
g('cs-mode').addEventListener('input',()=>update(false));
g('cs-rng').addEventListener('input',()=>update(false));
g('cs-all').addEventListener('change',()=>update(false));
g('cs-prev').onclick=()=>{g('cs-rng').stepDown();update(false)};
g('cs-next').onclick=()=>{g('cs-rng').stepUp();update(false)};
g('cs-save').onclick=()=>{
  if(!data)return;
  const a=document.createElement('a');a.href=cv.toDataURL('image/png');
  a.download=`minecraft-${g('cs-shape').value}-${g('cs-w').value}.png`;document.body.appendChild(a);a.click();a.remove();
};
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>update(false))}catch(e){}
update(true);
})();
