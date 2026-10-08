import {useEffect,useRef,useState,type ReactNode} from 'react';
import IconBold from '@tabler/icons-react/dist/esm/icons/IconBold.mjs';
import IconItalic from '@tabler/icons-react/dist/esm/icons/IconItalic.mjs';
import IconStrikethrough from '@tabler/icons-react/dist/esm/icons/IconStrikethrough.mjs';
import IconList from '@tabler/icons-react/dist/esm/icons/IconList.mjs';
import IconListNumbers from '@tabler/icons-react/dist/esm/icons/IconListNumbers.mjs';
import IconCheckbox from '@tabler/icons-react/dist/esm/icons/IconCheckbox.mjs';
import IconQuote from '@tabler/icons-react/dist/esm/icons/IconQuote.mjs';
import IconCode from '@tabler/icons-react/dist/esm/icons/IconCode.mjs';
import {EditorContent,useEditor} from '@tiptap/react';
import type {Editor} from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {richTextExtensions} from './rich-text-schema';
import {Icon} from './icons';

export function MarkdownText({value}:{value:string}){
 return <div className="rendered-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{a:({href,children})=><a href={href} target="_blank" rel="noopener noreferrer" onPointerDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>{children}</a>}}>{value}</ReactMarkdown></div>;
}
export default function RichTextEditor({value,onChange,readOnly=false,placeholder='写下你的想法…',autoFocus=false,onExit}:{value:string;onChange:(value:string)=>void;readOnly?:boolean;placeholder?:string;autoFocus?:boolean;onExit?:()=>void}){
 const update=useRef(onChange),last=useRef(value);update.current=onChange;
 const editorRef=useRef<Editor|null>(null);
 const linkSelection=useRef({from:1,to:1});
 const [linkOpen,setLinkOpen]=useState(false),[url,setUrl]=useState(''),[linkError,setLinkError]=useState('');
 const editor=useEditor({extensions:[...richTextExtensions(),Placeholder.configure({placeholder})],content:value,contentType:'markdown',editable:!readOnly,autofocus:autoFocus?'end':false,shouldRerenderOnTransaction:true,
  editorProps:{attributes:{class:'rich-document',role:'textbox','aria-label':'正文','aria-multiline':'true'},handlePaste:(view,event)=>{
   const text=event.clipboardData?.getData('text/plain');
   if(!text||event.clipboardData?.getData('text/html')||view.state.selection.$from.parent.type.spec.code)return false;
   if(!/^(?:#{1,6} |[-*+] |\d+\. |> |```|\|.*\|)|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)/m.test(text))return false;
   event.preventDefault();return editorRef.current?.commands.insertContent(text,{contentType:'markdown'})??false;
  },handleKeyDown:(_view,event)=>{if(event.key==='Escape'&&!event.isComposing&&onExit){event.preventDefault();onExit();return true;}return false;}},
  onUpdate:({editor})=>{const next=editor.getMarkdown();last.current=next;update.current(next);},
 });
 editorRef.current=editor;
 useEffect(()=>{if(editor&&value!==last.current){editor.commands.setContent(value,{contentType:'markdown',emitUpdate:false});last.current=value;}},[editor,value]);
 useEffect(()=>{editor?.setEditable(!readOnly,false);},[editor,readOnly]);
 if(!editor)return null;
 const heading=editor.isActive('heading',{level:1})?'1':editor.isActive('heading',{level:2})?'2':editor.isActive('heading',{level:3})?'3':'0';
 const button=(icon:ReactNode,label:string,active:boolean,action:()=>void)=><button type="button" title={label} aria-label={label} aria-pressed={active} onPointerDown={e=>e.preventDefault()} onClick={action}>{icon}</button>;
 const link=()=>{const href=url.trim();if(href&&!/^(https?:\/\/|mailto:)/i.test(href)){setLinkError('请输入 https://、http:// 或 mailto: 链接');return;}const chain=editor.chain().focus().setTextSelection(linkSelection.current).extendMarkRange('link');if(href&&linkSelection.current.from===linkSelection.current.to&&!editor.isActive('link'))chain.insertContent({type:'text',text:href,marks:[{type:'link',attrs:{href}}]}).run();else href?chain.setLink({href}).run():chain.unsetLink().run();setLinkOpen(false);setLinkError('');};
 return <section className="rich-editor" onPointerDown={e=>e.stopPropagation()} onKeyDownCapture={e=>{if(e.key==='Escape'&&!e.nativeEvent.isComposing&&linkOpen){e.preventDefault();e.stopPropagation();setLinkOpen(false);editor.commands.focus();}}}>
 {!readOnly&&<div className="rich-toolbar" aria-label="正文格式">
 <select aria-label="段落样式" value={heading} onChange={e=>{const level=Number(e.target.value);level?editor.chain().focus().setHeading({level:level as 1|2|3}).run():editor.chain().focus().setParagraph().run();}}><option value="0">正文</option><option value="1">标题 1</option><option value="2">标题 2</option><option value="3">标题 3</option></select>
 <div className="rich-tool-group" aria-label="文字格式">
 {button(<IconBold size={18}/>, '粗体',editor.isActive('bold'),()=>editor.chain().focus().toggleBold().run())}
 {button(<IconItalic size={18}/>, '斜体',editor.isActive('italic'),()=>editor.chain().focus().toggleItalic().run())}
 {button(<IconStrikethrough size={18}/>, '删除线',editor.isActive('strike'),()=>editor.chain().focus().toggleStrike().run())}
 </div>
 <span className="rich-divider"/>
 <div className="rich-tool-group" aria-label="段落格式">
 {button(<IconList size={18}/>, '无序列表',editor.isActive('bulletList'),()=>editor.chain().focus().toggleBulletList().run())}
 {button(<IconListNumbers size={18}/>, '有序列表',editor.isActive('orderedList'),()=>editor.chain().focus().toggleOrderedList().run())}
 {button(<IconCheckbox size={18}/>, '任务列表',editor.isActive('taskList'),()=>editor.chain().focus().toggleTaskList().run())}
 {button(<IconQuote size={18}/>, '引用',editor.isActive('blockquote'),()=>editor.chain().focus().toggleBlockquote().run())}
 {button(<IconCode size={18}/>, '代码块',editor.isActive('codeBlock'),()=>editor.chain().focus().toggleCodeBlock().run())}
 <button type="button" title="编辑链接" aria-label="编辑链接" aria-pressed={editor.isActive('link')} onPointerDown={e=>e.preventDefault()} onClick={()=>{linkSelection.current={from:editor.state.selection.from,to:editor.state.selection.to};setUrl(editor.getAttributes('link').href||'');setLinkError('');setLinkOpen(!linkOpen);}}><Icon name="link" size={18}/></button>
 </div><span className="rich-divider"/><div className="rich-tool-group" aria-label="编辑历史"><button type="button" aria-label="撤销正文编辑" title="撤销正文编辑" disabled={!editor.can().undo()} onPointerDown={e=>e.preventDefault()} onClick={()=>editor.chain().focus().undo().run()}><Icon name="undo" size={18}/></button><button type="button" aria-label="重做正文编辑" title="重做正文编辑" disabled={!editor.can().redo()} onPointerDown={e=>e.preventDefault()} onClick={()=>editor.chain().focus().redo().run()}><Icon name="redo" size={18}/></button></div>
 </div>}
 {linkOpen&&<form className="rich-link" onSubmit={e=>{e.preventDefault();link();}}><label>链接地址<input autoFocus aria-label="正文链接地址" placeholder="https://…" value={url} onChange={e=>setUrl(e.target.value)}/></label><button type="submit" className="soft-button">应用</button><button type="button" onClick={()=>{setLinkOpen(false);editor.commands.focus();}}>取消</button>{editor.isActive('link')&&<button type="button" onClick={()=>{setUrl('');editor.chain().focus().setTextSelection(linkSelection.current).extendMarkRange('link').unsetLink().run();setLinkOpen(false);}}>移除链接</button>}{linkError&&<small role="alert">{linkError}</small>}</form>}
 <EditorContent editor={editor}/>
 </section>;
}
