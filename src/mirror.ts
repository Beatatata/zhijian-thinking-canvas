import {workspaceFiles} from './export';
import type {Project} from './model';
export interface SyncDirectory {name:string;getDirectoryHandle(name:string,options?:{create:boolean}):Promise<SyncDirectory>;getFileHandle(name:string,options?:{create:boolean}):Promise<SyncFile>;queryPermission(options:{mode:'readwrite'}):Promise<string>;requestPermission(options:{mode:'readwrite'}):Promise<string>}
export interface SyncFile {getFile():Promise<Blob>;createWritable():Promise<{write(data:Blob|string|Uint8Array):Promise<void>;close():Promise<void>}>}
type Manifest={projectId:string;files:Record<string,string>};
async function resolveFile(dir:SyncDirectory,path:string,create:boolean){const parts=path.split('/');if(parts.some(p=>!p||p==='.'||p==='..'))throw Error('文件路径无效');for(const part of parts.slice(0,-1))dir=await dir.getDirectoryHandle(part,{create});return dir.getFileHandle(parts.at(-1)!,{create});}
async function existing(dir:SyncDirectory,path:string):Promise<Blob|undefined>{try{return await (await resolveFile(dir,path,false)).getFile();}catch(e){if((e as {name?:string}).name==='NotFoundError')return;throw e;}}
const hash=async(data:string|Uint8Array|Blob)=>{const bytes=data instanceof Blob?await data.arrayBuffer():typeof data==='string'?new TextEncoder().encode(data):data;return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes as BufferSource))].map(n=>n.toString(16).padStart(2,'0')).join('');};
// Preflight every file before writing. Unknown and externally edited files are never overwritten.
export async function writeMirror(dir:SyncDirectory,p:Project){
 const manifestBlob=await existing(dir,'.zhijian-sync.json');const previous:Manifest=manifestBlob?JSON.parse(await manifestBlob.text()):{projectId:p.id,files:{}};
 if(previous.projectId!==p.id||!previous.files||typeof previous.files!=='object')throw Error('该目录不属于当前工作台');
 const files=workspaceFiles(p,p.rootId,true),next:Manifest={projectId:p.id,files:{...previous.files}},writes:Array<[string,string|Uint8Array]>=[];
 for(const [path,data] of files){const desired=await hash(data),old=await existing(dir,path);if(old){const actual=await hash(old);if(actual!==desired&&actual!==previous.files[path])throw Error(`检测到外部修改：${path}。请保留修改或选择新的同步位置。`);if(actual===desired){next.files[path]=desired;continue;}}writes.push([path,data]);next.files[path]=desired;}
 for(const [path,data] of writes){const stream=await (await resolveFile(dir,path,true)).createWritable();await stream.write(typeof data==='string'?data:new Blob([data as BlobPart]));await stream.close();}
 const stream=await (await resolveFile(dir,'.zhijian-sync.json',true)).createWritable();await stream.write(JSON.stringify({...next,updatedAt:new Date().toISOString()},null,2));await stream.close();return writes.length;
}
