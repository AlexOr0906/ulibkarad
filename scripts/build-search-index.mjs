import fs from 'node:fs/promises';
import {sitePages} from '../src/data/site-pages.ts';
export async function buildSearchIndex(dir,base){
 const decode=text=>text.replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(amp|quot|apos|lt|gt|nbsp);/g,(_,n)=>({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' '})[n]);
 const pages=await Promise.all(sitePages.map(async page=>{
  const html=await fs.readFile(new URL(page.path+'index.html',dir),'utf8');
  const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||'';
  const text=decode(main.replace(/<(script|style|svg|dialog)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
  return {...page,url:base+page.path,text};
 }));
 await fs.writeFile(new URL('search-index.json',dir),JSON.stringify({version:1,pages}));
}
