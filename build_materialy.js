// Spouští se automaticky při každém nasazení na Netlify.
// Projde .html soubory a ze štítků <meta name="zd-..."> sestaví materialy.json.
const fs=require('fs');
const rx=n=>new RegExp('<meta\\s+name=["\']zd-'+n+'["\']\\s+content=["\']([^"\']*)["\']','i');
const dec=s=>s.replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const out=[];
try{
 for(const f of fs.readdirSync('.').filter(f=>f.toLowerCase().endsWith('.html')&&f!=='index.html').sort()){
  const h=fs.readFileSync(f,'utf8').slice(0,6000);
  const g=n=>{const m=h.match(rx(n));return m?dec(m[1]).trim():''};
  const title=g('title');if(!title)continue;
  const o={id:f.replace(/\.html$/i,'').replace(/[^a-z0-9_-]/gi,'-'),cat:g('cat')||'cesko',label:g('label')||'Materiál',icon:g('icon')||'📄',title,desc:g('desc'),tag:g('tag'),file:f};
  if(g('also'))o.also=g('also');
  if(g('od'))o.od=g('od');
  out.push(o);
 }
}catch(e){console.error('build_materialy:',e.message)}
out.sort((a,b)=>(b.od||'').localeCompare(a.od||''));
fs.writeFileSync('materialy.json',JSON.stringify(out,null,1));
console.log('materialy.json:',out.length,'materiálů');
