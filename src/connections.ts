import type {Rect} from './model';
export function connectionRect(rect:Rect,kind:string,target?:Rect):Rect {
 void target;
 return kind==='board'?{x:rect.x+(rect.w-62)/2,y:rect.y+8,w:62,h:62}:rect;
}
/** Connect side midpoints, with a draggable midpoint offset for cubic curves. */
export function connectionPath(a:Rect,b:Rect,curve:number,bend?:{x:number;y:number}){
 const ac={x:a.x+a.w/2,y:a.y+a.h/2},bc={x:b.x+b.w/2,y:b.y+b.h/2};
 const horizontal=Math.abs(bc.x-ac.x)>=Math.abs(bc.y-ac.y),sign=Math.sign(horizontal?bc.x-ac.x:bc.y-ac.y)||1;
 const start=horizontal?{x:ac.x+sign*(a.w/2+8),y:ac.y}:{x:ac.x,y:ac.y+sign*(a.h/2+8)};
 const end=horizontal?{x:bc.x-sign*(b.w/2+8),y:bc.y}:{x:bc.x,y:bc.y-sign*(b.h/2+8)};
 const mid={x:(start.x+end.x)/2,y:(start.y+end.y)/2};
 if(!curve)return {d:`M${start.x},${start.y} L${end.x},${end.y}`,x:mid.x,y:mid.y,start,end,mid};
 const reach=Math.max(30,Math.min(180,Math.hypot(end.x-start.x,end.y-start.y)*.4));
 const shift={x:(bend?.x||0)*4/3,y:(bend?.y||0)*4/3};
 const c1={x:start.x+(horizontal?sign*reach:0)+shift.x,y:start.y+(horizontal?0:sign*reach)+shift.y};
 const c2={x:end.x-(horizontal?sign*reach:0)+shift.x,y:end.y-(horizontal?0:sign*reach)+shift.y};
 return {d:`M${start.x},${start.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`,x:mid.x+(bend?.x||0),y:mid.y+(bend?.y||0),start,end,mid};
}
