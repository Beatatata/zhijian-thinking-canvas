import {test} from 'node:test';
import assert from 'node:assert/strict';
import {splitTask,indentTask,formatSelection} from './editing';
const tasks=[{id:'a',text:'研究产品交互',done:true,indent:0}];
test('Enter splits Chinese text at selection and retains source completion',()=>{const r=splitTask(tasks,0,2,4,'b');assert.deepEqual(r.tasks.map(t=>[t.text,t.done]),[['研究',true],['交互',false]]);assert.equal(tasks[0].text,'研究产品交互');});
test('Empty nested item Enter outdents instead of creating another empty item',()=>{const r=splitTask([{...tasks[0],text:'',indent:2}],0,0,0,'b');assert.equal(r.tasks.length,1);assert.equal(r.tasks[0].indent,1);assert.equal(r.focus,'a');});
test('Indent cannot skip levels or nest the first row',()=>{assert.equal(indentTask(tasks,0,false)[0].indent,0);const two=[...tasks,{...tasks[0],id:'b',indent:0}];assert.equal(indentTask(two,1,false)[1].indent,1);assert.equal(indentTask(two,1,true)[1].indent,0);});
test('Formatting preserves surrounding text and selects the inner content',()=>{assert.deepEqual(formatSelection('想法重点继续',2,4,'bold'),{text:'想法**重点**继续',start:4,end:6});assert.equal(formatSelection('标题\n甲\n乙',3,6,'list').text,'标题\n- 甲\n- 乙');});
