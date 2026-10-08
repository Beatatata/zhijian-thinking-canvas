import type {Rect} from './model';
export type Guides={gx?:number;gy?:number;xStart?:number;xEnd?:number;yStart?:number;yEnd?:number};
export function visualRect(r:Rect,kind:string):Rect {return kind==='board'?{x:r.x+(r.w-62)/2,y:r.y+6,w:62,h:62}:r;}
export function intersects(a:Rect,b:Rect){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
export function bounds(rects:Rect[]):Rect {
 const x=Math.min(...rects.map(r=>r.x)),y=Math.min(...rects.map(r=>r.y));
 return {x,y,w:Math.max(...rects.map(r=>r.x+r.w))-x,h:Math.max(...rects.map(r=>r.y+r.h))-y};
}
export function snapRect(moving:Rect,others:Rect[],threshold:number,_previous:Guides={}){
 let dx=0,dy=0,bestX=threshold,bestY=threshold;
 const result:Guides={};
 // Match edges to edges and centers to centers, never center to an unrelated edge.
 for(const r of others){
 for(const [a,b] of [[moving.x,r.x],[moving.x+moving.w,r.x+r.w],[moving.x+moving.w/2,r.x+r.w/2]]){
 const d=Math.abs(b-a);
 if(d<bestX){bestX=d;dx=b-a;result.gx=b;result.yStart=Math.min(moving.y,r.y)-12;result.yEnd=Math.max(moving.y+moving.h,r.y+r.h)+12;}
 }
 for(const [a,b] of [[moving.y,r.y],[moving.y+moving.h,r.y+r.h],[moving.y+moving.h/2,r.y+r.h/2]]){
 const d=Math.abs(b-a);
 if(d<bestY){bestY=d;dy=b-a;result.gy=b;result.xStart=Math.min(moving.x,r.x)-12;result.xEnd=Math.max(moving.x+moving.w,r.x+r.w)+12;}
 }
 }
 return {dx,dy,...result};
}
