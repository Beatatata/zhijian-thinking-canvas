import type {TableData} from './model';
export const progressLabels={planned:'未开始',active:'进行中',blocked:'受阻',done:'已完成'} as const;
export function addTableRow(table:TableData,id:string):TableData{return table.rows.length>=100?table:{...table,rows:[...table.rows,{id,cells:table.columns.map(()=>'')}]};}
export function addTableColumn(table:TableData):TableData{return table.columns.length>=8?table:{columns:[...table.columns,`列 ${table.columns.length+1}`],rows:table.rows.map(r=>({...r,cells:[...r.cells,'']}))};}
export function removeTableRow(table:TableData,id:string):TableData{return table.rows.length<=1?table:{...table,rows:table.rows.filter(r=>r.id!==id)};}
export function removeTableColumn(table:TableData,col:number):TableData{return table.columns.length<=1||col<0||col>=table.columns.length?table:{columns:table.columns.filter((_,i)=>i!==col),rows:table.rows.map(r=>({...r,cells:r.cells.filter((_,i)=>i!==col)}))};}
