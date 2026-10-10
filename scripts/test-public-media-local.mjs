// Isolated database-mode HTTP regression; never reads or writes production.
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { spawn } from "node:child_process";
const db = await PGlite.create();
const server = new PGLiteSocketServer({ db, host: "127.0.0.1", port: 55440, maxConnections: 10 });
await server.start();
const runner = String.raw`
import fs from 'node:fs';import {spawn,execFileSync} from 'node:child_process';import assert from 'node:assert/strict';import postgres from 'postgres';
const url='postgresql://postgres@127.0.0.1:55440/shams_test';
execFileSync(process.execPath,['scripts/db-migrate.mjs'],{env:{...process.env,DATABASE_URL:url},stdio:'pipe',timeout:30000});
const sql=postgres(url,{prepare:false,max:1,connect_timeout:5});
const records=JSON.parse(fs.readFileSync('scripts/db-seed-data.json')).records;
const template=records.find(r=>r.type==='artist');records.push({...template,id:'custom-artist',slug:'custom-artist',data:{...template.data,id:'custom-artist',slug:'custom-artist',name:'Independent artist'}});
const gallery=records.find(r=>r.type==='gallery');records.push({...gallery,id:'custom-gallery',data:{...gallery.data,id:'custom-gallery'}});
for(const r of records){const data={...r.data};if(r.type==='artist'||r.type==='gallery')data.image='https://legacy.example/unsupported.jpg';if(r.type==='artist')data.shortBio='Editorial text preserved by database-mode HTTP regression.';await sql\x60INSERT INTO content_records(id,type,slug,status,sort_order,data) VALUES (\x24{r.id},\x24{r.type},\x24{r.slug},\x24{r.status},\x24{r.sortOrder},\x24{sql.json(data)})\x60;}
await sql.end({timeout:1});
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','-p','3051'],{stdio:['ignore','ignore','pipe'],env:{...process.env,DATABASE_URL:url,DATABASE_POOL_MAX:'1',CONTENT_SOURCE:'database',CONTENT_DATABASE_FAILURE:'error',ADMIN_EMAIL:'',ADMIN_PASSWORD:'',ADMIN_SESSION_SECRET:''}});
let logs='';child.stderr.on('data',x=>logs+=x);
try{for(let n=0;n<60;n++){try{await fetch('http://127.0.0.1:3051/robots.txt');break}catch{await new Promise(r=>setTimeout(r,250));}}
for(const path of ['/','/artists/nour','/artists/custom-artist','/sitemap.xml']){const r=await fetch('http://127.0.0.1:3051'+path);const html=await r.text();assert.equal(r.status,200,path+" server log: "+logs);assert.ok(!html.includes('The sun slipped'),path+' error boundary: '+logs);if(path==='/artists/nour')assert.ok(html.includes('Editorial text preserved'),path);if(path==='/artists/custom-artist'){assert.ok(html.includes('Independent artist'));assert.ok(html.includes('media-unavailable.svg'));}console.log('PASS database-mode legacy media',path);}
const og=await fetch('http://127.0.0.1:3051/opengraph-image');assert.equal(og.status,200);assert.match(og.headers.get('content-type'),/image\/png/);const bytes=new Uint8Array(await og.arrayBuffer());assert.deepEqual([...bytes.slice(0,8)],[137,80,78,71,13,10,26,10]);assert.ok(!logs.includes('Failed to load dynamic font'));console.log('PASS social image PNG, no dynamic glyph download error');
}finally{child.kill();}
`;
try {
  const source = runner.replaceAll("\\x60", "`").replaceAll("\\x24", "$");
  const child = spawn(process.execPath, ["--input-type=module", "-e", source], { stdio: "inherit" });
  process.exitCode = await new Promise((resolve, reject) => { child.on("exit", c => resolve(c ?? 1)); child.on("error", reject); });
} finally { await server.stop(); await db.close(); }
