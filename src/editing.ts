import type {Task} from './model';

// Split at the caret, replacing selected text just like Enter in a text editor.
export function splitTask(tasks:Task[],index:number,start:number,end:number,id:string){
 const task=tasks[index];
 if(!task.text && task.indent>0)return {tasks:tasks.map((t,i)=>i===index?{...t,indent:t.indent-1}:t),focus:task.id};
 const next=tasks.map(t=>({...t}));
 next[index].text=task.text.slice(0,start);
 next.splice(index+1,0,{id,text:task.text.slice(end),done:false,indent:task.indent});
 return {tasks:next,focus:id};
}
export function indentTask(tasks:Task[],index:number,outdent:boolean){
 const max=index>0?Math.min(3,tasks[index-1].indent+1):0;
 return tasks.map((t,i)=>i===index?{...t,indent:outdent?Math.max(0,t.indent-1):Math.min(max,t.indent+1)}:t);
}
export function formatSelection(text:string,start:number,end:number,kind:'bold'|'italic'|'heading'|'list'){
 if(kind==='heading'||kind==='list'){
  const from=text.lastIndexOf('\n',start-1)+1,prefix=kind==='heading'?'## ':'- ';
  const part=text.slice(from,end).split('\n').map(line=>prefix+line).join('\n');
  return {text:text.slice(0,from)+part+text.slice(end),start:start+prefix.length,end:from+part.length};
 }
 const mark=kind==='bold'?'**':'*',selection=text.slice(start,end)||'文字';
 return {text:text.slice(0,start)+mark+selection+mark+text.slice(end),start:start+mark.length,end:start+mark.length+selection.length};
}
