// One static entity graph in source and rendered HTML; no runtime replacement.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const origin='https://seo-moldova.github.io';
export function siteGraph({canonical,title,description,lang,image,extra=[]}) {
  const person={'@type':'Person','@id':`${origin}/#person`,name:'Ivan Pridorojnov',alternateName:'Иван Придорожнов',url:`${origin}/about.html`,jobTitle:'Independent SEO specialist',image:`${origin}/images/ivan-pridorojnov.webp`,email:'ipridorojnov@gmail.com',sameAs:['https://www.linkedin.com/in/ivan-pridorojnov-2197571a7/','https://t.me/Iezuit'],knowsLanguage:['ru','ro','en'],homeLocation:{'@type':'City',name:'Bălți',containedInPlace:{'@type':'Country',name:'Moldova'}}};
  const website={'@type':'WebSite','@id':`${origin}/#website`,url:origin+'/',name:'Ivan Pridorojnov — SEO, Google Ads & GEO',inLanguage:['ru','ro','en'],publisher:{'@id':person['@id']}};
  const pathname=new URL(canonical).pathname;
  const type=/\/(about|experience)\.html$|\/cv[23]?\.html$/.test(pathname)?'ProfilePage':/\/contacts\.html$/.test(pathname)?'ContactPage':/\/projects\.html$/.test(pathname)?'CollectionPage':'WebPage';
  const page={'@type':type,'@id':canonical+'#webpage',url:canonical,name:title,description,inLanguage:lang,isPartOf:{'@id':website['@id']},about:{'@id':person['@id']}};
  if(image) page.primaryImageOfPage={'@type':'ImageObject',url:image};
  if(type==='ProfilePage')page.mainEntity={'@id':person['@id']};
  const nodes=[person,website,page,...extra.filter(n=>['Service','BreadcrumbList'].includes(n['@type']))];
  if(pathname.startsWith('/projects/')){
    const work={'@type':'CreativeWork','@id':canonical+'#case',url:canonical,name:title,description,inLanguage:lang,author:{'@id':person['@id']},mainEntityOfPage:{'@id':page['@id']}};
    if(image)work.image=image;
    nodes.push(work);page.mainEntity={'@id':work['@id']};
  }
  const service=nodes.find(n=>n['@type']==='Service');
  if(service){page.mainEntity={'@id':service['@id']};service.mainEntityOfPage={'@id':page['@id']};}
  return {'@context':'https://schema.org','@graph':nodes};
}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function normalize(directory){
 let count=0;
 for(const item of await readdir(directory,{withFileTypes:true})){
  if(item.name.startsWith('.')||['tools','research','reports','images'].includes(item.name))continue;
  const p=path.join(directory,item.name);
  if(item.isDirectory()){count+=await normalize(p);continue;}
  if(!p.endsWith('.html')||item.name==='velora-action-plan.html')continue;
  let s=await readFile(p,'utf8');const canonical=s.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];if(!canonical)continue;
  const decode=x=>x.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  const title=decode(s.match(/<title>([\s\S]*?)<\/title>/)?.[1]||'');const description=decode(s.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/)?.[1]||'');const lang=s.match(/<html lang="([^"]+)"/)?.[1]||'ru';
  const image=s.match(/<meta\b[^>]*property="og:image"[^>]*content="([^"]+)"/)?.[1];
  const rx=/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  const existing=[...s.matchAll(rx)].flatMap(m=>{const j=JSON.parse(m[1]);return j['@graph']||[j]});
  const graph=siteGraph({canonical,title,description,lang,image,extra:existing});const tag='<script type="application/ld+json" id="jsonld-script">'+JSON.stringify(graph).replace(/</g,'\\u003c')+'</script>';
  let inserted=false;s=s.replace(rx,()=>{if(inserted)return '';inserted=true;return tag;});if(!inserted)s=s.replace('</head>',tag+'\n</head>');
  s=s.replace(/\s*<script src="\/js\/seo-schema\.js" defer><\/script>/g,'');
  await writeFile(p,s);count++;
 }
 return count;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) console.log(`Normalized ${await normalize(root)} page graphs`);
