import type {Rect} from './model';
export function arrangeRects(rects:Rect[],mode:'left'|'top'|'horizontal'|'vertical'):Rect[]{
 const result=rects.map(r=>({...r}));
 if(result.length<2)return result;
 if(mode==='left'||mode==='top'){
  const axis=mode==='left'?'x':'y',value=Math.min(...result.map(r=>r[axis]));
  result.forEach(r=>r[axis]=value);return result;
 }
 const axis=mode==='horizontal'?'x':'y',size=mode==='horizontal'?'w':'h';
 const sorted=[...result].sort((a,b)=>a[axis]-b[axis]);
 const first=sorted[0],last=sorted[sorted.length-1];
 const gap=(last[axis]+last[size]-first[axis]-sorted.reduce((sum,r)=>sum+r[size],0))/(sorted.length-1);
 let position=first[axis];sorted.forEach(r=>{r[axis]=position;position+=r[size]+gap;});return result;
}
