export const accentColors=[['晴蓝','#51b9f7'],['蜂蜜','#ffd44f'],['薄荷','#60d6c4'],['橙子','#ff914d'],['桃粉','#f56ecb'],['丁香','#b5a0f3'],['珊瑚','#ff7474'],['草绿','#91cf60'],['湖蓝','#5bcbd7'],['靛蓝','#7989ed'],['玫瑰','#dd7c9b'],['陶土','#ca956f'],['深海','#315779'],['松针','#36766a'],['葡萄','#785b93'],['石墨','#525968'],['莓红','#c94b65'],['朱红','#e55c45'],['琥珀','#e8a83d'],['橄榄','#a2a743'],['森林','#2e9d70'],['孔雀','#169eab'],['海军','#3e63b8'],['紫罗兰','#9468cc'],['烟粉','#d49baa'],['银灰','#a6adb8'],['墨黑','#303641'],['象牙','#e9e4d8']];
export const softColors=[['纯白','#ffffff'],['云灰','#f4f5f7'],['樱花','#fff0f3'],['花瓣','#ffe4e8'],['杏桃','#fff1e8'],['冰蓝','#f0f9ff'],['浅蓝','#e0f4ff'],['水绿','#e6f7f4'],['奶油','#fff9dd'],['蜂蜜','#ffefb5'],['薄荷','#eaf6e9'],['鼠尾草','#e2eee4'],['青柠','#f1f7d9'],['丁香','#f4eaff'],['薰衣草','#ece9fb'],['浅紫','#faeafa']];
export const boardThemes=[
 {id:'mist',name:'雾白',note:'清爽、留白、适合长期研究',canvas:'#eef0f3',paper:'#ffffff',column:'#fafbfc',ink:'#344054',accents:['#4C8BF5','#F6C94C','#52C7B8','#F28C63','#D878BA']},
 {id:'nord',name:'Nord',note:'北欧冷静色板',canvas:'#E5E9F0',paper:'#ECEFF4',column:'#D8DEE9',ink:'#2E3440',accents:['#5E81AC','#88C0D0','#A3BE8C','#EBCB8B','#B48EAD']},
 {id:'solarized',name:'Solarized',note:'经典低对比暖纸',canvas:'#FDF6E3',paper:'#FFFCF0',column:'#EEE8D5',ink:'#586E75',accents:['#268BD2','#2AA198','#859900','#B58900','#D33682']},
 {id:'catppuccin',name:'Catppuccin',note:'柔软的粉彩层次',canvas:'#EFF1F5',paper:'#FFFFFF',column:'#E6E9EF',ink:'#4C4F69',accents:['#1E66F5','#179299','#40A02B','#DF8E1D','#EA76CB']},
 {id:'tokyo',name:'Tokyo Night',note:'夜间专注模式',canvas:'#1A1B26',paper:'#24283B',column:'#1F2335',ink:'#C0CAF5',accents:['#7AA2F7','#2AC3DE','#9ECE6A','#E0AF68','#BB9AF7']},
 {id:'bauhaus',name:'Bauhaus',note:'高对比几何色彩',canvas:'#F5F1E8',paper:'#FFFDF8',column:'#EEE7D9',ink:'#27272A',accents:['#2454A6','#E13B35','#F2C230','#18956E','#24272E']}
] as const;
export const themeFor=(id?:string)=>boardThemes.find(theme=>theme.id===id)||boardThemes[0];
export function mutedFor(hex:string){const bg=/^#[\da-f]{6}$/i.test(hex)?hex:'#ffffff',channels=[1,3,5].map(i=>parseInt(bg.slice(i,i+2),16));const dark=inkFor(bg)==='#ffffff';return '#'+channels.map(c=>Math.round(dark?c+(255-c)*.65:c*.65).toString(16).padStart(2,'0')).join('');}
export function inkFor(hex:string){if(!/^#[\da-f]{6}$/i.test(hex))return '#344054';const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722<.3?'#ffffff':'#344054';}

export function checkboxFor(hex:string){const bg=/^#[\da-f]{6}$/i.test(hex)?hex:'#ffffff',dark=inkFor(bg)==='#ffffff';return '#'+[1,3,5].map(i=>{const c=parseInt(bg.slice(i,i+2),16);return Math.round(dark?255-(255-c)*.45:c*.78).toString(16).padStart(2,'0');}).join('');}
import type {Project} from './model';
export function applyWorkspaceTheme(p:Project,id:string){const theme=themeFor(id),defaults=new Set<string>(boardThemes.flatMap(t=>[t.paper,t.column,...t.accents]));for(const board of Object.values(p.boards))board.theme=theme.id;Object.values(p.cards).sort((a,b)=>a.order-b.order).forEach((n,i)=>{if(n.kind==='board'||n.accentExplicit)n.color=theme.accents[i%theme.accents.length];if(n.kind==='column')n.fill=theme.column;else if(!n.fill||defaults.has(n.fill))n.fill=theme.paper;});}
