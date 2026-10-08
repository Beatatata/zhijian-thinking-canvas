import PlanningCard from './PlanningCard';
import {useEffect,useRef} from 'react';
import RichTextEditor from './RichTextEditor';
import {Icon} from './icons';
import InlineCard from './InlineCard';
import {inkFor,mutedFor,checkboxFor} from './appearance';
import type {Asset,Card} from './model';

type Props={card:Card;asset?:Asset;readOnly:boolean;onChange:(patch:Partial<Card>)=>void;onClose:()=>void;onCover:()=>void;theme:{canvas:string;paper:string;ink:string}};
/** A full-page writing surface that keeps the card's data and editing controls intact. */
export default function FocusEditor({card,asset,readOnly,onChange,onClose,onCover,theme}:Props){
 const root=useRef<HTMLElement>(null),close=useRef(onClose);close.current=onClose;
 useEffect(()=>{const frame=requestAnimationFrame(()=>root.current?.querySelector<HTMLInputElement|HTMLTextAreaElement>('textarea,input')?.focus());const down=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!event.isComposing&&!event.defaultPrevented){event.preventDefault();close.current();}};window.addEventListener('keydown',down);return()=>{cancelAnimationFrame(frame);window.removeEventListener('keydown',down);};},[card.id]);
 const vars={'--focus-canvas':theme.canvas,'--focus-paper':card.fill||theme.paper,'--focus-ink':inkFor(card.fill||theme.paper),'--task-fill':checkboxFor(card.fill||theme.paper),'--card-fill':card.fill||theme.paper,'--card-muted':mutedFor(card.fill||theme.paper),'--card-color':card.accentExplicit?card.color:'transparent'} as Record<string,string>;
 const withTitle=(event:React.ChangeEvent<HTMLInputElement>)=>onChange({title:event.target.value});
 return <section ref={root} className="focus-editor" style={vars} aria-label="专注编辑">
  <header className="focus-header"><button aria-label="退出专注编辑" title="退出专注编辑（Esc）" onClick={onClose}><Icon name="back" size={19}/>返回画布</button><span>{card.kind==='todo'?'清单':card.kind==='link'?'链接':card.kind==='image'?'图片笔记':card.kind==='table'?'表格':card.kind==='progress'?'进度':'笔记'} · 专注编辑</span><button className="focus-done" onClick={onClose}>完成</button></header>
  <main className="focus-stage"><article className={'focus-sheet '+card.kind}>
   {card.kind==='image'?<>{asset&&<img src={asset.data} alt={card.body||card.title||'参考图片'}/>}<div className="focus-image-fields"><input aria-label="图片标题" value={card.title} placeholder="图片标题" readOnly={readOnly} onChange={withTitle}/><RichTextEditor value={card.body} onChange={body=>onChange({body})} readOnly={readOnly}/></div></>:
   ['table','progress'].includes(card.kind)?<PlanningCard card={card} readOnly={readOnly} onChange={onChange} onBoundary={()=>undefined} onEditing={()=>undefined}/>:card.kind==='todo'?<InlineCard card={card} readOnly={readOnly} onChange={onChange} onBoundary={()=>undefined} onMeasure={()=>undefined} onEditing={()=>undefined}/>:<div className="focus-writing">{card.kind==='link'&&<section className={'focus-cover '+(asset?'has-cover':'empty-cover')} aria-label="链接封面">{asset?<><img className="focus-link-cover" src={asset.data} alt={card.title||'链接封面'}/>{!readOnly&&<div className="focus-cover-actions"><button onClick={onCover}><Icon name="image" size={17}/>更换封面</button><button onClick={()=>onChange({assetId:undefined,ratio:undefined})}>移除封面</button></div>}</>:!readOnly&&<button className="focus-cover-add" onClick={onCover}><Icon name="image" size={25}/><strong>添加封面图片</strong><span>选择图片，为链接添加视觉参考</span></button>}</section>}<div className="focus-title-row">{card.showIcon&&<Icon name={card.icon} size={28} variant={card.iconStyle||'outline'}/>}<input aria-label="卡片标题" value={card.title} placeholder="添加标题" readOnly={readOnly} onChange={withTitle}/></div>{card.kind==='link'&&<input className="focus-url" aria-label="网址" value={card.url||''} placeholder="粘贴网址 https://…" readOnly={readOnly} onChange={event=>onChange({url:event.target.value})}/>}<RichTextEditor placeholder={card.kind==='link'?'添加备注':'写下你的想法…'} value={card.body} onChange={body=>onChange({body})} readOnly={readOnly}/></div>}
  </article></main>
 </section>;
}
