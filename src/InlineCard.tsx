import {useLayoutEffect,useRef,useState,type PointerEvent,type TextareaHTMLAttributes} from 'react';
import {Icon} from './icons';
import {MarkdownText} from './RichTextEditor';
import {uid,type Card,type Task} from './model';
import {splitTask,indentTask} from './editing';

export function Field(props:TextareaHTMLAttributes<HTMLTextAreaElement>){
 const ref=useRef<HTMLTextAreaElement>(null);
 useLayoutEffect(()=>{const el=ref.current;if(!el)return;const resize=()=>{el.style.height='0px';el.style.height=el.scrollHeight+'px';};resize();let width=el.clientWidth;const observer=new ResizeObserver(()=>{if(el.clientWidth!==width){width=el.clientWidth;resize();}});observer.observe(el);return()=>observer.disconnect();},[props.value]);
 return <textarea {...props} ref={ref} rows={1}/>;
}

type Props={card:Card;readOnly:boolean;cover?:string;onCover?:()=>void;onChange:(patch:Partial<Card>)=>void;onBoundary:()=>void;onMeasure:(h:number,w:number)=>void;onEditing:(active:boolean)=>void};
const moveTask=(tasks:Task[],from:string,to:string)=>{const a=tasks.findIndex(task=>task.id===from),b=tasks.findIndex(task=>task.id===to);if(a<0||b<0||a===b)return tasks;const next=[...tasks],item=next.splice(a,1)[0];next.splice(b,0,item);return next;};

export default function InlineCard({card:n,readOnly,onChange,onBoundary,onMeasure,onEditing,cover,onCover}:Props){
 const box=useRef<HTMLDivElement>(null),dragTask=useRef<{id:string;x:number;y:number;active:boolean;to:string}|null>(null),suppressClick=useRef(false);
 const [dragging,setDragging]=useState(''),[dropTask,setDropTask]=useState('');
 const tasks=n.tasks||[];
 useLayoutEffect(()=>{const el=box.current;if(!el)return;const measure=()=>onMeasure(Math.ceil(el.offsetHeight)+parseFloat(getComputedStyle(el.parentElement!).borderTopWidth)+parseFloat(getComputedStyle(el.parentElement!).borderBottomWidth),el.parentElement!.clientWidth+2);const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect();},[onMeasure]);
 const focusTask=(id:string,pos?:number)=>requestAnimationFrame(()=>{const el=box.current?.querySelector<HTMLTextAreaElement>(`[data-task="${id}"]`);el?.focus();if(pos!==undefined)el?.setSelectionRange(pos,pos);});
 const taskDown=(event:PointerEvent<HTMLDivElement>,id:string)=>{event.stopPropagation();suppressClick.current=false;if(readOnly||event.button!==0||(event.target as HTMLElement).closest('input[type=checkbox]'))return;dragTask.current={id,x:event.clientX,y:event.clientY,active:false,to:id};suppressClick.current=false;};
 const taskMove=(event:PointerEvent<HTMLDivElement>)=>{const drag=dragTask.current;if(!drag)return;if(!drag.active&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<5)return;drag.active=true;event.preventDefault();event.stopPropagation();event.currentTarget.setPointerCapture(event.pointerId);setDragging(drag.id);const rows=Array.from(box.current?.querySelectorAll<HTMLElement>('[data-task-row]')||[]);const target=rows.find(row=>{const r=row.getBoundingClientRect();return event.clientY>=r.top&&event.clientY<=r.bottom;});if(target){drag.to=target.dataset.taskRow!;setDropTask(drag.to);}};
 const taskEnd=(event:PointerEvent<HTMLDivElement>)=>{const drag=dragTask.current;if(!drag)return;event.stopPropagation();dragTask.current=null;setDragging('');setDropTask('');if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);if(drag.active){event.preventDefault();suppressClick.current=true;onBoundary();onChange({tasks:moveTask(tasks,drag.id,drag.to)});onBoundary();(document.activeElement as HTMLElement)?.blur();}};
 return <div ref={box} className="inline-card" onFocus={()=>onEditing(true)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node)){onBoundary();onEditing(false);}}} onKeyDown={event=>{if(!event.nativeEvent.isComposing&&(event.key==='Escape'||((event.metaKey||event.ctrlKey)&&event.key==='Enter'))){event.preventDefault();(document.activeElement as HTMLElement)?.blur();}}}>
  {n.kind==='link'&&cover&&<div className="link-cover" onPointerDown={event=>event.stopPropagation()}><img draggable={false} src={cover} alt={n.title||'链接封面'}/>{!readOnly&&onCover&&<button className="link-cover-control" aria-label="更换链接封面" onClick={onCover}><Icon name="image" size={16}/>更换封面</button>}</div>}<div className="inline-title-row">{n.showIcon&&<span className="inline-title-icon"><Icon name={n.icon} size={22} variant={n.iconStyle||'outline'}/></span>}<Field className="inline-title" aria-label="卡片标题" placeholder="添加标题" value={n.title} readOnly={readOnly} onChange={event=>onChange({title:event.target.value})} onKeyDown={event=>{if(event.key==='Enter'&&!event.nativeEvent.isComposing){event.preventDefault();box.current?.querySelector<HTMLElement>('.markdown-read-surface,.rich-document,[data-task]')?.focus();}}}/></div>
  {n.kind==='todo'?<div className="inline-tasks">{tasks.map((task,index)=><div data-task-row={task.id} className={`inline-task ${dragging===task.id?'task-moving':''} ${dragging&&dropTask===task.id&&dragging!==task.id?'task-drop':''}`} key={task.id} style={{paddingLeft:task.indent*16}} onPointerDownCapture={event=>taskDown(event,task.id)} onPointerMove={taskMove} onPointerUp={taskEnd} onPointerCancel={()=>{dragTask.current=null;setDragging('');setDropTask('');}} onClickCapture={event=>{if(suppressClick.current){event.preventDefault();event.stopPropagation();suppressClick.current=false;}}} ><input aria-label={`完成待办 ${index+1}`} type="checkbox" checked={task.done} disabled={readOnly} onChange={event=>onChange({tasks:tasks.map(item=>item.id===task.id?{...item,done:event.target.checked}:item)})}/><Field data-task={task.id} aria-label={`待办 ${index+1}`} className={task.done?'done':''} placeholder="输入待办" value={task.text} readOnly={readOnly} onChange={event=>onChange({tasks:tasks.map(item=>item.id===task.id?{...item,text:event.target.value}:item)})} onKeyDown={event=>{
   if(readOnly||event.nativeEvent.isComposing)return;const el=event.currentTarget;
   if(event.key==='Tab'){event.preventDefault();onChange({tasks:indentTask(tasks,index,event.shiftKey)});}
   if(event.key==='Enter'&&!event.shiftKey&&!event.metaKey&&!event.ctrlKey){event.preventDefault();const result=splitTask(tasks,index,el.selectionStart,el.selectionEnd,uid());onChange({tasks:result.tasks});focusTask(result.focus,0);}
   if(event.key==='Backspace'&&!task.text&&tasks.length>1){event.preventDefault();const remaining=tasks.filter(item=>item.id!==task.id);onChange({tasks:remaining});const target=remaining[Math.max(0,index-1)];if(target)focusTask(target.id,target.text.length);}
   if((event.key==='ArrowUp'&&el.selectionStart===0&&el.selectionEnd===0)||(event.key==='ArrowDown'&&el.selectionStart===task.text.length&&el.selectionEnd===task.text.length)){const target=event.key==='ArrowUp'?tasks[index-1]:tasks[index+1];if(target){event.preventDefault();focusTask(target.id,event.key==='ArrowUp'?target.text.length:0);}}
  }}/><span className="task-drag" title="拖动整行排序"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 5h10M3 8h10M3 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span></div>)}</div>:<>
   {n.kind==='link'&&(/^https?:\/\//.test(n.url||'')?<a className="inline-url reading-url" href={n.url} target="_blank" rel="noopener noreferrer" onPointerDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>{n.url}</a>:<span className="inline-url rich-placeholder">双击添加网址</span>)}
   {(n.kind!=='link'||!!n.body)&&<div className="card-body-reading" aria-label="正文">{n.body?<MarkdownText value={n.body}/>:<span className="rich-placeholder">双击卡片，写下你的想法…</span>}</div>}

   {n.kind==='link'&&/^https?:\/\//.test(n.url||'')&&<a className="inline-open-link" href={n.url} target="_blank" rel="noreferrer">打开链接 ↗</a>}
  </>}
 </div>;
}
