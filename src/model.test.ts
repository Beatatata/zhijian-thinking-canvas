import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seed,validate,addCard,splitSelection,projected,pathTo,removeCards,layout,copy,moveIntoBoard,duplicateCards,uid} from './model';
import {markdown,markdownZip} from './export';
import JSZip from 'jszip';
test('分栏宽度决定画板入口列数，扩宽后可并排四个入口',()=>{const p=seed(),col=addCard(p,p.rootId,'column',0,0);col.w=560;const kids=Array.from({length:5},(_,i)=>{const n=addCard(p,p.rootId,'board',0,0);n.columnId=col.id;n.order=i;return n;});const wide=layout(p,p.rootId);assert.equal(wide[kids[0].id].y,wide[kids[3].id].y);assert.ok(wide[kids[4].id].y>wide[kids[0].id].y);col.w=280;const narrow=layout(p,p.rootId);assert.ok(narrow[kids[2].id].y>narrow[kids[0].id].y);validate(p);});
test('移入已有子画板保留内容与关系，清除旧分栏归属并可校验',()=>{const p=seed(),entry=Object.values(p.cards).find(n=>n.title==='产品探索')!,col=addCard(p,p.rootId,'column',0,0),a=addCard(p,p.rootId,'note',0,0),b=addCard(p,p.rootId,'todo',0,0);a.columnId=col.id;a.body='保留正文';const id=uid();p.edges[id]={id,from:a.id,to:b.id,label:'关系',curve:0,dashed:false,arrow:true};moveIntoBoard(p,[a.id,b.id],entry.target!);assert.equal(a.columnId,undefined);assert.equal(a.boardId,entry.target);assert.equal(a.body,'保留正文');assert.equal(projected(p,a.id,p.rootId),entry.id);assert.equal(p.edges[id].from,a.id);validate(p);});
test('初始工作台可校验，复制快照不影响原始内容',()=>{const p=seed();validate(p);const next=copy(p);const n=Object.values(next.cards).find(n=>n.kind==='todo')!;n.tasks![0].done=true;assert.equal(p.cards[n.id].tasks![0].done,false);});
test('拆分保留 ID、内部关系、外部关系投影和子画板归属',()=>{const p=seed(),root=p.rootId;const a=addCard(p,root,'note',100,200),b=addCard(p,root,'board',400,200),c=addCard(p,root,'note',700,200);const id=uid();p.edges[id]={id,from:a.id,to:c.id,label:'参考',curve:0,dashed:false,arrow:true};const entry=splitSelection(p,root,[a.id,b.id],'深入');assert.equal(p.cards[a.id].boardId,p.cards[entry].target);assert.equal(projected(p,a.id,root),entry);assert.equal(p.boards[b.target!].parentId,p.cards[entry].target);assert.equal(p.edges[id].from,a.id);validate(p);});
test('50 层画板导航完整且阻止循环移动',()=>{const p=seed();let board=p.rootId;let first='';for(let i=0;i<50;i++){const n=addCard(p,board,'board',0,0);if(!i)first=n.id;board=n.target!;}assert.equal(pathTo(p,board).length,51);assert.throws(()=>moveIntoBoard(p,[first],board));validate(p);});
test('删除分栏只解散归属，保留内容位置',()=>{const p=seed();const col=Object.values(p.cards).find(n=>n.kind==='column')!;const child=Object.values(p.cards).find(n=>n.columnId===col.id)!;const r=layout(p,col.boardId)[child.id];removeCards(p,[col.id]);assert.equal(child.columnId,undefined);assert.equal(child.x,r.x);assert.equal(child.y,r.y);validate(p);});
test('删除子画板递归删除内容与相关连线，其他分支保留',()=>{const p=seed();const n=Object.values(p.cards).find(n=>n.title==='产品探索')!;removeCards(p,[n.id]);assert.equal(p.boards[n.target!],undefined);assert.ok(Object.values(p.cards).some(n=>n.title==='视觉参考'));validate(p);});
test('复制分栏重新映射子卡片，不修改原来的清单',()=>{const p=seed();const col=Object.values(p.cards).find(n=>n.kind==='column')!;const ids=duplicateCards(p,[col.id]);assert.equal(Object.values(p.cards).filter(n=>n.columnId===ids[0]).length,2);validate(p);});
test('导出包含递归 Markdown、关系与真实图片附件',async()=>{const p=seed();const id=uid();p.assets[id]={id,name:'test.png',mime:'image/png',data:'data:image/png;base64,aGVsbG8='};const n=addCard(p,p.rootId,'image',0,0);n.assetId=id;n.body='测试图';const md=markdown(p,p.rootId);assert.match(md,/测试图/);assert.match(md,/整理成表达/);const blob=await markdownZip(p,p.rootId);const zip=await JSZip.loadAsync(await blob.arrayBuffer());assert.equal(await zip.file(`assets/${id}.png`)!.async('string'),'hello');assert.equal(Object.keys(zip.files).filter(f=>f.startsWith('boards/')&&f.endsWith('.md')).length,Object.keys(p.boards).length);});
test('拒绝缺失附件及循环层级的备份',()=>{const p=seed();const image=addCard(p,p.rootId,'image',0,0);image.assetId='missing';assert.throws(()=>validate(p));delete p.cards[image.id];const b=Object.values(p.boards).find(b=>b.parentId)!;b.parentId=b.id;assert.throws(()=>validate(p));});
test('复制整个研究分支保留后代与连线并分配独立 ID',()=>{const p=seed();const n=Object.values(p.cards).find(n=>n.title==='产品探索')!;const ids=duplicateCards(p,[n.id]);assert.notEqual(p.cards[ids[0]].target,n.target);assert.equal(Object.values(p.cards).filter(c=>c.boardId===p.cards[ids[0]].target).length,7);validate(p);});
test('外观字段在复制、拆分及备份校验中保留，旧数据兼容',()=>{const p=seed();validate(p);const n=addCard(p,p.rootId,'note',0,0);n.fill='#fff0f3';n.iconStyle='filled';const clone=duplicateCards(p,[n.id])[0];assert.equal(p.cards[clone].fill,n.fill);splitSelection(p,p.rootId,[n.id],'配色测试');validate(JSON.parse(JSON.stringify(p)));p.cards[n.id].fill='bad';assert.throws(()=>validate(p));});

test('measured long cards expand their column and move later siblings',()=>{
 const p=seed(),board=p.rootId,col=addCard(p,board,'column',0,0),a=addCard(p,board,'note',0,0),b=addCard(p,board,'todo',0,0);
 a.columnId=col.id;a.order=0;b.columnId=col.id;b.order=1;
 const measured={[a.id]:{w:col.w-24,h:1200}};
 const r=layout(p,board,measured);
 assert.equal(r[a.id].h,1200);assert.equal(r[b.id].y,r[a.id].y+1214);assert.ok(r[col.id].h>1200);
 assert.notEqual(layout(p,board,{[a.id]:{w:100,h:1200}})[a.id].h,1200);
});
test('复制分栏内单张卡片时使用可见位置，不会回到分栏左上角',()=>{
 const p=seed(),col=Object.values(p.cards).find(n=>n.kind==='column')!,child=Object.values(p.cards).find(n=>n.columnId===col.id)!;
 const before=layout(p,child.boardId)[child.id],clone=duplicateCards(p,[child.id])[0],after=p.cards[clone];
 assert.equal(after.columnId,undefined);assert.equal(after.x,before.x+28);assert.equal(after.y,before.y+28);validate(p);
});
test('足够宽的分栏把连续画板入口排成两列，其他卡片仍占整行',()=>{
 const p=seed(),col=addCard(p,p.rootId,'column',0,0),a=addCard(p,p.rootId,'board',0,0),b=addCard(p,p.rootId,'board',0,0),note=addCard(p,p.rootId,'note',0,0);
 a.columnId=col.id;a.order=0;b.columnId=col.id;b.order=1;note.columnId=col.id;note.order=2;
 const r=layout(p,p.rootId);
 assert.equal(r[a.id].y,r[b.id].y);assert.ok(r[b.id].x>r[a.id].x);assert.ok(r[note.id].y>r[a.id].y+r[a.id].h);validate(p);
});
test('图片纸张留白按内侧图片宽度计算高度，图标可选字段兼容旧数据',()=>{
 const p=seed(),id=uid();p.assets[id]={id,name:'image.png',mime:'image/png',data:'data:image/png;base64,aGVsbG8='};const image=addCard(p,p.rootId,'image',0,0);image.assetId=id;image.ratio=2;image.w=300;const framed=layout(p,p.rootId)[image.id].h;image.imageFrame=false;const flush=layout(p,p.rootId)[image.id].h;
 assert.ok(framed>flush);const note=addCard(p,p.rootId,'note',0,0);note.showIcon=true;validate(p);
});
