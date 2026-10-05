// chunk
function chunk(){
  const x=n('cx'),z=n('cz');
  if(x===null||z===null){$('cout').innerHTML='';return}
  const X=Math.floor(x),Z=Math.floor(z),cx=Math.floor(X/16),cz=Math.floor(Z/16);
  show('cout',[['チャンク座標',`${cx}, ${cz}`],['チャンク内位置',`${X-cx*16}, ${Z-cz*16}`],
  ['チャンクの範囲 X',`${cx*16} 〜 ${cx*16+15}`],['チャンクの範囲 Z',`${cz*16} 〜 ${cz*16+15}`],
  ['チャンク中心',`${cx*16+8}, ${cz*16+8}`],['リージョンファイル',`r.${Math.floor(cx/32)}.${Math.floor(cz/32)}.mca`]]);
}
['cx','cz'].forEach(i=>$(i).oninput=chunk);
