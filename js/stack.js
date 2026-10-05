// stacks
function stack(){
  const v=n('sn'),s=+$('ss').value;
  if(v===null||v<0){$('sout').innerHTML='';return}
  const c=Math.floor(v);const full=Math.floor(c/s),rem=c%s,slots=Math.ceil(c/s);
  show('sout',[['スタック',s===1?`${f(c,0)} 個`:`${f(full,0)} スタック + ${rem} 個`],['必要スロット',f(slots,0)],
  ['チェスト',f(slots/27,2)+' 個分'],['ラージチェスト',f(slots/54,2)+' 個分'],['シュルカーボックス',f(slots/27,2)+' 個分']]);
}
$('sn').oninput=stack;$('ss').onchange=stack;
