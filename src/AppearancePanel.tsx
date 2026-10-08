import {useState} from 'react';
import {Icon,topicCatalog,hasFilled} from './icons';
import {accentColors,softColors,inkFor} from './appearance';
import type {Card} from './model';
type Props={cards:Card[];onChange:(patch:Partial<Card>)=>void;onClose:()=>void;palette?:readonly string[]};
export default function AppearancePanel({cards,onChange,onClose,}:Props){
 const first=cards[0],onlyBoards=cards.every(n=>n.kind==='board'),onlyImages=cards.every(n=>n.kind==='image'),supportsIcons=cards.every(n=>['note','link','todo','board','progress','table'].includes(n.kind));
 const [tab,setTab]=useState<'color'|'icon'>('color'),[field,setField]=useState<'fill'|'color'>('color'),[custom,setCustom]=useState('#60d6c4'),[iconVariant,setIconVariant]=useState<'outline'|'filled'>('filled');
 const variant=iconVariant,actualField=onlyBoards?'color':field;
 const value=actualField==='color'&&!onlyBoards&&!first.accentExplicit?'':first[actualField]||'',mixed=cards.some(n=>(actualField==='color'&&!onlyBoards&&!n.accentExplicit?'':n[actualField]||'')!==value);
 const apply=(color:string)=>onChange({[actualField]:color,...(actualField==='color'&&!onlyBoards?{accentExplicit:!!color}:{})});
 const filtered=topicCatalog.filter(i=>(variant==='outline'||hasFilled(i.id)));
 return <aside className="appearance-panel" aria-label="外观设置" onPointerDown={e=>e.stopPropagation()}>
  <div className="appearance-heading"><div><strong>外观</strong></div><button title="关闭外观设置" onClick={onClose}><Icon name="x" size={18}/></button></div>
  <div className="appearance-tabs"><button className={tab==='color'?'active':''} onClick={()=>setTab('color')}><Icon name="palette" size={17}/>颜色</button>{supportsIcons&&<button className={tab==='icon'?'active':''} onClick={()=>setTab('icon')}><Icon name="apps" size={17}/>图标</button>}</div>
  {tab==='color'?<div className="appearance-content">
   {!onlyBoards&&<div className="segmented"><button className={field==='color'?'active':''} onClick={()=>setField('color')}>顶部色条</button><button className={field==='fill'?'active':''} onClick={()=>setField('fill')}>背景填充</button></div>}
   {mixed&&<p className="mixed-value">选中内容使用了不同颜色</p>}
   <label>可选颜色</label><div className="color-grid">{[...accentColors,...softColors].map(([name,c])=><button key={c} title={`${name} ${c}`} aria-label={name} aria-pressed={!mixed&&value===c} style={{background:c,color:inkFor(c)}} onClick={()=>apply(c)}>{!mixed&&value===c&&<Icon name="check" size={16}/>}</button>)}</div>
   {onlyImages&&<><label>图片留白</label><div className="segmented"><button className={first.imageFrame!==false?'active':''} onClick={()=>onChange({imageFrame:true})}>保留留白</button><button className={first.imageFrame===false?'active':''} onClick={()=>onChange({imageFrame:false})}>铺满图片</button></div></>}
   <label>自定义颜色</label><form className="custom-color" onSubmit={e=>{e.preventDefault();if(/^#[\da-f]{6}$/i.test(custom))apply(custom.toLowerCase());}}><input type="color" aria-label="自定义取色" value={/^#[\da-f]{6}$/i.test(custom)?custom:'#ffffff'} onChange={e=>setCustom(e.target.value)}/><input aria-label="十六进制颜色" value={custom} maxLength={7} onChange={e=>setCustom(e.target.value)} placeholder="#60d6c4"/><button disabled={!/^#[\da-f]{6}$/i.test(custom)}>应用</button></form>
   <button className="reset-appearance" onClick={()=>apply('')}><Icon name="undo" size={15}/>恢复默认{actualField==='fill'?'背景':'颜色'}</button>
  </div>:<div className="appearance-content">{!onlyBoards&&<button className="icon-none" aria-pressed={!first.showIcon&&first.kind!=='board'} onClick={()=>onChange({showIcon:false})}>不显示图标</button>}{onlyBoards&&<><label>图标颜色</label><div className="segmented"><button className={first.iconTone!=='white'?'active':''} onClick={()=>onChange({iconTone:'dark'})}>深色</button><button className={first.iconTone==='white'?'active':''} onClick={()=>onChange({iconTone:'white'})}>白色</button></div></>}<div className="segmented"><button className={variant==='filled'?'active':''} onClick={()=>setIconVariant('filled')}>实心</button><button className={variant==='outline'?'active':''} onClick={()=>setIconVariant('outline')}>线条</button></div><div className="topic-grid">{filtered.map(i=><button key={i.id} aria-label={i.label} title={i.label+(variant==='filled'&&!hasFilled(i.id)?' · 此图标使用线条版':'')} aria-pressed={first.icon===i.id&&(first.kind==='board'||!!first.showIcon)&&first.iconStyle===variant} onClick={()=>onChange({icon:i.id,iconStyle:variant,showIcon:true})}><Icon name={i.id} size={25} variant={variant}/><span>{i.label.split(' ')[0]}</span></button>)}</div></div>}
 </aside>;
}
