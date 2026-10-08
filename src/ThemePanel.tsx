import {Icon} from './icons';
import {boardThemes} from './appearance';
import type {Board} from './model';

type Props={board:Board;onChange:(theme:string)=>void;onClose:()=>void};
export default function ThemePanel({board,onChange,onClose}:Props){
 return <aside className="theme-panel" aria-label="画布风格" onPointerDown={e=>e.stopPropagation()}>
  <div className="appearance-heading"><div><strong>画布风格</strong><small>整个工作台统一配色</small></div><button title="关闭画布风格" onClick={onClose}><Icon name="x" size={18}/></button></div>
  <div className="theme-list">{boardThemes.map(theme=><button key={theme.id} className={board.theme===theme.id||(!board.theme&&theme.id==='mist')?'active':''} onClick={()=>onChange(theme.id)}>
   <span className="theme-swatch" style={{background:theme.canvas}}><i style={{background:theme.paper}}/><b>{theme.accents.map(c=><em key={c} style={{background:c}}/>)}</b></span>
   <span><strong>{theme.name}</strong><small>{theme.note}</small></span><Icon name="check" size={16}/>
  </button>)}</div>
  <div className="appearance-footer">应用到所有画板；自定义卡片背景仍可单独调整。</div>
 </aside>;
}
