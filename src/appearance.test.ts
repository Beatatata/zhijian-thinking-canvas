import test from 'node:test';
import assert from 'node:assert/strict';
import {applyWorkspaceTheme,checkboxFor,themeFor} from './appearance';
import {seed,addCard,validate,height} from './model';
import {markdown} from './export';
test('切换风格覆盖全部画板，新建子画板继承，独立背景保留',()=>{const p=seed(),note=Object.values(p.cards).find(n=>n.kind==='note')!;note.fill='#123456';applyWorkspaceTheme(p,'tokyo');assert.ok(Object.values(p.boards).every(b=>b.theme==='tokyo'));assert.equal(note.fill,'#123456');const child=addCard(p,p.rootId,'board',0,0);assert.equal(p.boards[child.target!].theme,'tokyo');validate(p);});
test('待办背景在浅色正片叠底，在深色滤色',()=>{assert.equal(checkboxFor('#ffffff'),'#c7c7c7');assert.equal(checkboxFor('#000000'),'#8c8c8c');assert.notEqual(checkboxFor('#4060b0'),checkboxFor('#ffffff'));});
test('空图片不保留标题说明空间，填写后卡片高度增加',()=>{const p=seed(),n=addCard(p,p.rootId,'image',0,0);n.ratio=1;const before=height(n);n.title='图片标题';n.body='说明';assert.ok(height(n)>before);n.title='';n.body='';assert.equal(height(n),before);assert.equal(themeFor('tokyo').paper,'#24283B');});
test('链接封面可校验并保留 Markdown 引用，缺失附件拒绝恢复',()=>{const p=seed(),n=addCard(p,p.rootId,'link',0,0);n.title='参考';n.url='https://example.com';n.assetId='cover';p.assets.cover={id:'cover',name:'cover.png',mime:'image/png',data:'data:image/png;base64,AAAA'};validate(p);assert.match(markdown(p,p.rootId),/assets\/cover.png/);delete p.assets.cover;assert.throws(()=>validate(p));});
