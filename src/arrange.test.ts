import test from 'node:test';
import assert from 'node:assert/strict';
import {arrangeRects} from './arrange';
test('distribution preserves endpoints and accounts for different widths',()=>{
 const items=[{x:0,y:10,w:40,h:30},{x:90,y:20,w:60,h:30},{x:300,y:30,w:80,h:30}];
 const result=arrangeRects(items,'horizontal');
 assert.deepEqual(result.map(r=>r.x),[0,140,300]);
 assert.equal(items[1].x,90);
 assert.deepEqual(arrangeRects(items,'top').map(r=>r.y),[10,10,10]);
});
