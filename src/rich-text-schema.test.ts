import test from 'node:test';
import assert from 'node:assert/strict';
import {MarkdownManager} from '@tiptap/markdown';
import {richTextExtensions} from './rich-text-schema';

const manager=()=>new MarkdownManager({extensions:richTextExtensions(),markedOptions:{gfm:true,breaks:true}});
test('formatted notes retain headings, inline marks, lists and links through Markdown storage',()=>{
 const m=manager(),source='## 理清方向\n\n**重点**与*补充*，~~不采用~~。\n\n- 收集线索\n- [查看参考](https://www.tatalab.ai/)\n\n> 先拆出问题\n\n1. 第一步\n2. 第二步';
 const doc=m.parse(source),serialized=m.serialize(doc);
 assert.deepEqual(m.parse(serialized),doc);
 assert.equal(doc.content?.[0].type,'heading');
 assert.ok(serialized.includes('**重点**'));
 assert.ok(serialized.includes('https://www.tatalab.ai/'));
});
test('GFM tables, task states, code and image attachments survive formatted editing',()=>{
 const m=manager(),source='- [x] 已完成\n- [ ] 下一步\n\n| 方向 | 原因 |\n| --- | --- |\n| A | 更清晰 |\n\n```js\nconst x = "**literal**";\n```\n\n![参考](assets/reference.png)';
 const doc=m.parse(source),serialized=m.serialize(doc);
 assert.deepEqual(m.parse(serialized),doc);
 assert.equal(doc.content?.[0].content?.[0].attrs?.checked,true);
 assert.equal(doc.content?.[0].content?.[1].attrs?.checked,false);
 assert.ok(serialized.includes('assets/reference.png'));
 assert.ok(serialized.includes('"**literal**"'));
});
test('literal Markdown characters and Chinese line breaks are not converted into formatting accidentally',()=>{
 const m=manager(),doc=m.parse('\\*普通星号\\*\n下一行\n\n`**原样代码**`'),serialized=m.serialize(doc);
 assert.deepEqual(m.parse(serialized),doc);
 assert.equal(doc.content?.[0].content?.[0].text,'*普通星号*');
});
