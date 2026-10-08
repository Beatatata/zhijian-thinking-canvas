import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import {seed} from './model';
import {saveProject,trashProject,restoreProject,purgeProjects,listProjects,readSetting} from './storage';

test('permanent deletion only removes confirmed trash, blocks late saves and protects restored workspaces',async()=>{
 const active=seed(),trashed=seed(),restored=seed();
 await saveProject(active);await saveProject(trashed);await saveProject(restored);
 await trashProject(trashed.id);await trashProject(restored.id);await restoreProject(restored.id);
 await assert.rejects(purgeProjects([trashed.id,restored.id]),/回收站内容已改变/);
 assert.ok((await listProjects(true)).some(p=>p.id===trashed.id),'mixed purge must not partially delete valid trash');
 await assert.rejects(purgeProjects([active.id]),/回收站内容已改变/);
 await purgeProjects([trashed.id,trashed.id]);
 assert.ok(!(await listProjects(true)).some(p=>p.id===trashed.id));
 await saveProject(trashed);
 assert.ok(!(await listProjects()).some(p=>p.id===trashed.id),'queued saves cannot resurrect deleted content');
 await assert.rejects(restoreProject(trashed.id),/永久删除/);
 assert.equal(await readSetting('trash:'+trashed.id),undefined);
 assert.equal(await readSetting('sync:'+trashed.id),undefined);
 assert.ok((await listProjects()).some(p=>p.id===active.id));
 assert.ok((await listProjects()).some(p=>p.id===restored.id));
 await trashProject(restored.id);await purgeProjects([restored.id]);
 assert.equal((await listProjects(true)).length,0);
 assert.ok((await listProjects()).some(p=>p.id===active.id),'clearing trash retains active workspaces');
});
