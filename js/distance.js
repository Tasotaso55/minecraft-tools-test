// distance
function dist(){
  const [ax,ay,az,bx,by,bz]=['ax','ay','az','bx','by','bz'].map(n);
  if([ax,az,bx,bz].includes(null)){$('dout').innerHTML='';return}
  const dx=bx-ax,dz=bz-az,h=Math.hypot(dx,dz);
  const rows=[['水平距離(直線)',f(h)+' ブロック']];
  if(ay!==null&&by!==null){rows.push(['3D 直線距離',f(Math.hypot(dx,dz,by-ay))+' ブロック']);rows.push(['高低差',f(Math.abs(by-ay),0)+' ブロック'])}
  rows.push(['マンハッタン距離(X+Z)',f(Math.abs(dx)+Math.abs(dz),0)+' ブロック']);
  rows.push(['ネザー経由の移動量(1/8)',f(h/8)+' ブロック']);
  const t=(s)=>{const sec=h/s;return sec>=60?Math.floor(sec/60)+'分'+Math.round(sec%60)+'秒':f(sec)+'秒'};
  rows.push(['歩き',t(4.317)],['ダッシュ',t(5.612)],['ボート',t(8)],['氷上ボート',t(40)],['青氷ボート',t(72.7)]);
  show('dout',rows);
}
['ax','ay','az','bx','by','bz'].forEach(i=>$(i).oninput=dist);
