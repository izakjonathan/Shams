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
const records=JSON.parse(fs.readFileSync('scripts/db-seed-data.json')).records.filter(record=>record.id!=='page-home');
const template=records.find(r=>r.type==='artist');records.push({...template,id:'custom-artist',slug:'custom-artist',data:{...template.data,id:'custom-artist',slug:'custom-artist',name:'Independent artist'}});
const gallery=records.find(r=>r.type==='gallery');records.push({...gallery,id:'custom-gallery',data:{...gallery.data,id:'custom-gallery'}});
for(const r of records){const data={...r.data};if(r.type==='artist'||r.type==='gallery')data.image='https://legacy.example/unsupported.jpg';if(r.type==='artist')data.shortBio='Editorial text preserved by database-mode HTTP regression.';await sql\x60INSERT INTO content_records(id,type,slug,status,sort_order,data) VALUES (\x24{r.id},\x24{r.type},\x24{r.slug},\x24{r.status},\x24{r.sortOrder},\x24{sql.json(data)})\x60;}
await sql\x60DROP TABLE admin_login_attempts\x60;
await sql.end({timeout:1});
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','-p','3051'],{stdio:['ignore','ignore','pipe'],env:{...process.env,DATABASE_URL:url,DATABASE_POOL_MAX:'1',CONTENT_SOURCE:'database',CONTENT_DATABASE_FAILURE:'error',ADMIN_EMAIL:'owner@local.test',ADMIN_PASSWORD:'local-test-password-only',ADMIN_SESSION_SECRET:'local-test-session-secret-01234567890123456789'}});
let logs='';child.stderr.on('data',x=>logs+=x);
try{for(let n=0;n<60;n++){try{await fetch('http://127.0.0.1:3051/robots.txt');break}catch{await new Promise(r=>setTimeout(r,250));}}
for(const path of ['/','/artists/nour','/artists/custom-artist','/sitemap.xml']){const r=await fetch('http://127.0.0.1:3051'+path);const html=await r.text();assert.equal(r.status,200,path+" server log: "+logs);assert.ok(!html.includes('The sun slipped'),path+' error boundary: '+logs);if(path==='/artists/nour')assert.ok(html.includes('Editorial text preserved'),path);if(path==='/artists/custom-artist'){assert.ok(html.includes('Independent artist'));assert.ok(html.includes('media-unavailable.svg'));}console.log('PASS database-mode legacy media',path);}
const loginHtml=await(await fetch('http://127.0.0.1:3051/admin/login')).text();
const action=loginHtml.match(/name="(\$ACTION_ID_[^"]+)"/);assert.ok(action);
async function signIn(password){const f=new FormData();f.set(action[1],'');f.set('email','owner@local.test');f.set('password',password);return fetch('http://127.0.0.1:3051/admin/login',{method:'POST',body:f,headers:{Origin:'http://127.0.0.1:3051'},redirect:'manual'});}
const wrong=await signIn('deliberately-wrong');assert.equal(wrong.status,303);assert.equal(wrong.headers.get('location'),'/admin/login?error=credentials');console.log('PASS wrong credentials with missing protection table show credentials error');
const correct=await signIn('local-test-password-only');assert.equal(correct.status,303);assert.equal(correct.headers.get('location'),'/admin',logs);assert.match(correct.headers.get('set-cookie'),/shf-admin-session=/);console.log('PASS correct credentials initialize missing protection table and sign in');
const cookie=correct.headers.get('set-cookie').split(';')[0];
const admin=await fetch('http://127.0.0.1:3051/admin',{headers:{Cookie:cookie}});assert.equal(admin.status,200);const editingHtml=await admin.text();assert.ok(editingHtml.includes('simpleStudio'));assert.ok(editingHtml.replaceAll(/<!--.*?-->/g,'').includes('Add artist'));assert.ok(editingHtml.replaceAll(/<!--.*?-->/g,'').includes('Add FAQ'));assert.ok(editingHtml.includes('home:hero:titleLines'));assert.ok(!editingHtml.includes('Sections JSON'));console.log('PASS authenticated single-page editor with inline fields and homepage copy');
function decode(value){return value.replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>');}
function fields(html,id){const forms=[...html.matchAll(/<form[^>]*>([\s\S]*?)<\/form>/g)].map(match=>match[1]);const source=forms.find(form=>form.includes('name="id" value="'+id+'"'));assert.ok(source,'form '+id);const data=new FormData();for(const input of source.matchAll(/<input([^>]+)>/g)){const attrs=input[1];const name=attrs.match(/name="([^"]+)"/);if(!name||(/type="checkbox"/.test(attrs)&&!attrs.includes('checked')))continue;data.append(decode(name[1]),decode(attrs.match(/value="([^"]*)"/)?.[1]??''));}for(const textarea of source.matchAll(/<textarea[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/textarea>/g))data.append(decode(textarea[1]),decode(textarea[2]));for(const select of source.matchAll(/<select[^>]*name="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){const option=select[2].match(/<option[^>]*value="([^"]*)"[^>]*selected[^>]*>/)||select[2].match(/<option[^>]*value="([^"]*)"[^>]*>/);data.append(decode(select[1]),decode(option?.[1]??''));}data.set('intent','save');return data;}
async function save(data){return fetch('http://127.0.0.1:3051/admin',{method:'POST',body:data,headers:{Origin:'http://127.0.0.1:3051',Cookie:cookie},redirect:'manual'});}
const homepage=fields(editingHtml,'page-home');homepage.set('home:about:heading','Saved homepage copy from inline editor');let saved=await save(homepage);assert.equal(saved.status,303,(await saved.text()).slice(0,500));assert.match(saved.headers.get('location'),/section=page/);const live=await(await fetch('http://127.0.0.1:3051/')).text();assert.ok(live.includes('Saved homepage copy from inline editor'));console.log('PASS first homepage save creates validated content and updates public rendering');
const faq=records.find(record=>record.type==='faq');const faqForm=fields(editingHtml,faq.id);faqForm.set('question','Edited inline question?');saved=await save(faqForm);assert.equal(saved.status,303,(await saved.text()).slice(0,500));assert.ok((await(await fetch('http://127.0.0.1:3051/')).text()).includes('Edited inline question?'));console.log('PASS inline record save returns to editor and updates public content');
const freshHtml=await(await fetch('http://127.0.0.1:3051/admin',{headers:{Cookie:cookie}})).text();
const newFaqId=freshHtml.match(/name="id" value="(faq-[0-9a-f-]{36})"/)[1];const addFaq=fields(freshHtml,newFaqId);addFaq.set('question','New draft FAQ from inline form?');addFaq.set('answer','Draft FAQ answer.');saved=await save(addFaq);assert.equal(saved.status,303,(await saved.text()).slice(0,500));assert.ok(!(await(await fetch('http://127.0.0.1:3051/')).text()).includes('New draft FAQ from inline form?'));console.log('PASS add entry saves a draft that stays off the public site');
const draftHtml=await(await fetch('http://127.0.0.1:3051/admin',{headers:{Cookie:cookie}})).text();const publish=fields(draftHtml,newFaqId);publish.set('intent','publish');saved=await save(publish);assert.equal(saved.status,303,(await saved.text()).slice(0,500));assert.ok((await(await fetch('http://127.0.0.1:3051/')).text()).includes('New draft FAQ from inline form?'));console.log('PASS publish draft updates the live content view');
const contact=records.find(record=>record.id==='page-contact');const contactForm=fields(freshHtml,contact.id);contactForm.set('route:0:address','hello@local.test');saved=await save(contactForm);assert.equal(saved.status,303,(await saved.text()).slice(0,500));assert.ok((await(await fetch('http://127.0.0.1:3051/contact')).text()).includes('hello@local.test'));console.log('PASS labelled contact fields save without JSON input');
const publicHtml=await(await fetch('http://127.0.0.1:3051/')).text();assert.ok(!publicHtml.includes('class="inlineEdit'));console.log('PASS public homepage contains no editing controls');
const editor=await fetch('http://127.0.0.1:3051/admin/artists?edit='+encodeURIComponent(template.id),{headers:{Cookie:cookie}});assert.equal(editor.status,200);assert.ok((await editor.text()).includes('id="record-editor"'));console.log('PASS contextual artist edit link resolves to protected editor');
const wrongAfterSetup=await signIn('deliberately-wrong');assert.equal(wrongAfterSetup.headers.get('location'),'/admin/login?error=credentials');console.log('PASS wrong credentials after setup show credentials error');
for(let n=0;n<9;n++)await signIn('deliberately-wrong');
const limited=await signIn('local-test-password-only');assert.equal(limited.headers.get('location'),'/admin/login?error=throttled');console.log('PASS genuine attempt limit remains enforced even for correct credentials');
const og=await fetch('http://127.0.0.1:3051/opengraph-image');assert.equal(og.status,200);assert.match(og.headers.get('content-type'),/image\/png/);const bytes=new Uint8Array(await og.arrayBuffer());assert.deepEqual([...bytes.slice(0,8)],[137,80,78,71,13,10,26,10]);assert.ok(!logs.includes('Failed to load dynamic font'));console.log('PASS social image PNG, no dynamic glyph download error');
}finally{child.kill();}
`;
try {
  const source = runner.replaceAll("\\x60", "`").replaceAll("\\x24", "$");
  const child = spawn(process.execPath, ["--input-type=module", "-e", source], { stdio: "inherit" });
  process.exitCode = await new Promise((resolve, reject) => { child.on("exit", c => resolve(c ?? 1)); child.on("error", reject); });
} finally { await server.stop(); await db.close(); }
