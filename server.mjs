import http from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const port=Number(process.env.BRANCHBOARD_PORT||5178);
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
 try{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=await realpath(path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname)));
  if(!file.startsWith(root)){res.writeHead(403);res.end();return;}
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('文件未找到，请先执行 npm run build。');}
});
server.on('error',err=>{console.error(err.code==='EADDRINUSE'?'枝间已经在运行，请打开 http://127.0.0.1:5178':err.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`枝间已启动：http://127.0.0.1:${port}\n保持这个终端打开；Ctrl+C 停止。`));
