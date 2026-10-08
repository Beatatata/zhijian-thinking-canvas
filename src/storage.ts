import {openDB} from 'idb';
import {seed,type Project} from './model';
const db=openDB('branchboard-local',1,{upgrade(db){db.createObjectStore('projects');db.createObjectStore('settings');}});
export async function loadProject():Promise<Project|undefined>{const d=await db;const id=await d.get('settings','active');return id?d.get('projects',id):undefined;}
// First entry to 1.0 opens the tutorial; previous workspaces remain in the library.
export async function openWorkspace(writable:boolean):Promise<Project>{
 if(!writable)return (await loadProject())||seed();
 const d=await db,tx=d.transaction(['projects','settings'],'readwrite'),settings=tx.objectStore('settings'),projects=tx.objectStore('projects');
 const active=await settings.get('active'),saved:Project|undefined=active?await projects.get(active):undefined;
 let result=saved;
 if(!await settings.get('welcome-1.0.0')){
  result=seed();
  await projects.put(result,result.id);await settings.put(result.id,'active');await settings.put(true,'welcome-1.0.0');
 }
 await tx.done;return result||seed();
}
export async function saveProject(p:Project){const d=await db;const tx=d.transaction(['projects','settings'],'readwrite'),settings=tx.objectStore('settings');if(await settings.get('trash:'+p.id)||await settings.get('purged:'+p.id)){await tx.done;return;}await tx.objectStore('projects').put(p,p.id);await settings.put(p.id,'active');await tx.done;}
export async function listProjects(trashed=false):Promise<Project[]>{const d=await db,all:Project[]=await d.getAll('projects'),result:Project[]=[];for(const p of all)if(!!await d.get('settings','trash:'+p.id)===trashed)result.push(p);return result;}
export async function trashProject(id:string){const d=await db,tx=d.transaction('settings','readwrite');await tx.store.put(Date.now(),'trash:'+id);if(await tx.store.get('active')===id)await tx.store.delete('active');await tx.store.delete('sync:'+id);await tx.done;}
export async function restoreProject(id:string){const d=await db,tx=d.transaction(['projects','settings'],'readwrite');if(!await tx.objectStore('projects').get(id)||await tx.objectStore('settings').get('purged:'+id)){await tx.done;throw new Error('工作台已被永久删除');}await tx.objectStore('settings').delete('trash:'+id);await tx.done;}
/** Only the explicitly confirmed trash snapshot can be purged; late saves cannot revive it. */
export async function purgeProjects(ids:string[]){
 const d=await db,tx=d.transaction(['projects','settings'],'readwrite'),settings=tx.objectStore('settings'),projects=tx.objectStore('projects');
 const unique=[...new Set(ids)];
 for(const id of unique)if(!await settings.get('trash:'+id)){await tx.done;throw new Error('回收站内容已改变，请重新确认');}
 for(const id of unique){await projects.delete(id);await settings.delete('trash:'+id);await settings.delete('sync:'+id);await settings.put(true,'purged:'+id);if(await settings.get('active')===id)await settings.delete('active');}
 await tx.done;
}
export async function readSetting<T>(key:string):Promise<T|undefined>{return (await db).get('settings',key);}
export async function writeSetting(key:string,value:unknown){const d=await db;if(value===undefined)await d.delete('settings',key);else await d.put('settings',value,key);}
