// converter
function sync(from){
  const s=from==='o'?['ox','oy','oz']:['nx','ny','nz'],d=from==='o'?['nx','ny','nz']:['ox','oy','oz'];
  const [x,y,z]=s.map(n);
  const c=v=>v===null?'':(from==='o'?Math.floor(v/8):v*8);
  $(d[0]).value=c(x);$(d[1]).value=y===null?'':y;$(d[2]).value=c(z);
}
['ox','oy','oz'].forEach(i=>$(i).oninput=()=>sync('o'));
['nx','ny','nz'].forEach(i=>$(i).oninput=()=>sync('n'));

document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>{
  const [w,kind]=b.dataset.copy.split(':');
  const [x,y,z]=(w==='o'?['ox','oy','oz']:['nx','ny','nz']).map(i=>$(i).value);
  if(x===''||z==='')return;
  copyText(kind==='tp'?`/tp @s ${x} ${y===''?'~':y} ${z}`:(y===''?`${x} ${z}`:`${x} ${y} ${z}`),b);
});
