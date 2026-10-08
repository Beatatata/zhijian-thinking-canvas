import test from 'node:test';
import assert from 'node:assert/strict';
import {connectionRect,connectionPath} from './connections';
test('所有方向的画板连线基于图标可见边界',()=>{
 const a={x:10,y:20,w:160,h:130};
 assert.deepEqual(connectionRect(a,'board',{...a,x:410}),{x:59,y:28,w:62,h:62});
 assert.deepEqual(connectionRect(a,'board',{...a,y:420}),{x:59,y:28,w:62,h:62});
 assert.deepEqual(connectionRect(a,'note'),a);
});
test('曲线从模块侧边中点连接，锚点偏移保持贝塞尔中点准确',()=>{
 const a={x:0,y:0,w:200,h:300},b={x:500,y:100,w:200,h:100};
 const q=connectionPath(a,b,1,{x:20,y:90});
 assert.deepEqual(q.start,{x:208,y:150});assert.deepEqual(q.end,{x:492,y:150});
 assert.equal(q.x,370);assert.equal(q.y,240);assert.match(q.d,/ C/);
 const vertical=connectionPath(a,{...b,x:0,y:600},1);assert.equal(vertical.start.x,100);assert.equal(vertical.start.y,308);
});
test('水平与垂直方向连线端点均位于模块侧边正中',()=>{
 const a={x:0,y:0,w:200,h:100},b={x:400,y:250,w:240,h:300};
 const q=connectionPath(a,b,1);assert.equal(q.start.y,50);assert.equal(q.end.y,400);
 const vertical=connectionPath(a,{...b,x:0,y:500},1);assert.equal(vertical.start.x,100);assert.equal(vertical.end.x,120);
});
