import {useEffect,useState} from 'react';
import {readSetting,writeSetting} from './storage';
import type {Project} from './model';
import {writeMirror,type SyncDirectory} from './mirror';
type Config={connectionId:string;handle:SyncDirectory;enabled:boolean;lastVersion?:number;lastSync?:number};
const listeners=new Set<()=>void>(),states=new Map<string,string>();let queue=Promise.resolve();
const notice=(id:string,s:string)=>{states.set(id,s);for(const fn of listeners)fn();};
export const folderSupported=()=>typeof window!=='undefined'&&'showDirectoryPicker' in window&&window.isSecureContext;
export const syncFolderName=(id:string)=>'枝间-'+id.replace(/[^\w-]/g,'_');
export function useSyncStatus(id:string){const [,update]=useState(0);useEffect(()=>{const fn=()=>update(v=>v+1);listeners.add(fn);return()=>{listeners.delete(fn);};},[id]);return states.get(id)||'尚未连接文件夹';}
export async function synchronize(p:Project,force=false){
 const job=queue.then(async()=>{const cfg=await readSetting<Config>('sync:'+p.id);if(!cfg?.enabled){if(cfg&&!states.has(p.id))notice(p.id,'已暂停 · 本地文件保留');return;}if(!states.has(p.id))notice(p.id,cfg.lastSync?'已同步 · '+new Date(cfg.lastSync).toLocaleTimeString():'已连接 '+cfg.handle.name);if(!force&&cfg.lastVersion===p.updatedAt)return;try{if(await cfg.handle.queryPermission({mode:'readwrite'})!=='granted'){notice(p.id,'需要重新授权 · 点击立即同步');return;}notice(p.id,'正在同步…');const dir=await cfg.handle.getDirectoryHandle(syncFolderName(p.id),{create:true});await writeMirror(dir,p);const latest=await readSetting<Config>('sync:'+p.id);if(latest?.enabled&&latest.connectionId===cfg.connectionId){await writeSetting('sync:'+p.id,{...latest,lastVersion:p.updatedAt,lastSync:Date.now()});notice(p.id,'已同步 · '+new Date().toLocaleTimeString());}}catch(e){notice(p.id,'同步暂停 · '+(e as Error).message);await writeSetting('sync:'+p.id,{...cfg,enabled:false});throw e;}});queue=job.catch(()=>{});return job;
}
export async function connectFolder(p:Project){const picker=(window as unknown as {showDirectoryPicker(options:{mode:string}):Promise<SyncDirectory>}).showDirectoryPicker;const handle=await picker.call(window,{mode:'readwrite'});await writeSetting('sync:'+p.id,{handle,enabled:true,connectionId:crypto.randomUUID()});notice(p.id,'已连接 '+handle.name);await synchronize(p,true);}
export async function resumeSync(p:Project){const cfg=await readSetting<Config>('sync:'+p.id);if(!cfg)return connectFolder(p);if(await cfg.handle.requestPermission({mode:'readwrite'})!=='granted')throw Error('未获得文件夹写入权限');await writeSetting('sync:'+p.id,{...cfg,enabled:true});notice(p.id,'同步已恢复');return synchronize(p,true);}
export async function pauseSync(id:string){await queue;const cfg=await readSetting<Config>('sync:'+id);if(cfg)await writeSetting('sync:'+id,{...cfg,enabled:false});notice(id,'已暂停 · 本地文件保留');}
export function useAutoSync(p:Project|null,readOnly:boolean){useEffect(()=>{if(!p||readOnly)return;let cancelled=false;const timer=setTimeout(()=>{if(!cancelled)void synchronize(p).catch(()=>{});},1500);return()=>{cancelled=true;clearTimeout(timer);};},[p?.id,p?.updatedAt,readOnly]);}
