import {useLayoutEffect,useRef} from 'react';
import type {Asset,Card} from './model';
import {MarkdownText} from './RichTextEditor';

/** Measure the displayed image and optional metadata, without reserving empty fields. */
export default function ImageCard({card,asset,onMeasure}:{card:Card;asset?:Asset;onMeasure:(h:number,w:number)=>void}){
 const ref=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{const el=ref.current;if(!el)return;const measure=()=>{const parent=el.parentElement!,style=getComputedStyle(parent);onMeasure(Math.ceil(el.offsetHeight+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth)),parent.clientWidth+2);};const observer=new ResizeObserver(measure);observer.observe(el);measure();return()=>observer.disconnect();},[onMeasure]);
 return <div ref={ref} className="image-content"><img draggable={false} src={asset?.data} alt={card.title||'参考图片'}/>{(card.title||card.body)&&<div className="image-fields">{card.title&&<div className="image-title">{card.title}</div>}{card.body&&<div className="image-caption"><MarkdownText value={card.body}/></div>}</div>}</div>;
}
