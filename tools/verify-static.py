"""Check local URLs, metadata, language alternatives and selected release invariants."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit,unquote
import json,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1];origin='https://seo-moldova.github.io'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set();self.alt={};self.canonical=None;self.h1=0;self.scripts=[];self.inscript=False;self.buf='';self.robots='';self.description='';self.lang=''
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if t=='html':self.lang=a.get('lang','')
  if t=='h1':self.h1+=1
  if t=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if t=='link' and a.get('hreflang'):self.alt[a['hreflang']]=a.get('href')
  if t=='meta' and a.get('name')=='robots':self.robots=a.get('content','')
  if t=='meta' and a.get('name')=='description':self.description=a.get('content','')
  if t=='script' and a.get('type')=='application/ld+json':self.inscript=True;self.buf=''
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if t in ['img','script','source'] and a.get('src'):self.links.append(a['src'])
  if t=='link' and a.get('rel') in ['stylesheet','icon','manifest','apple-touch-icon'] and a.get('href'):self.links.append(a['href'])
 def handle_data(self,d):
  if self.inscript:self.buf+=d
 def handle_endtag(self,t):
  if t=='script' and self.inscript:self.scripts.append(self.buf);self.inscript=False
pages={};errors=[]
for p in root.rglob('*.html'):
 if any(x.startswith('.') for x in p.relative_to(root).parts):continue
 doc=Page();doc.feed(p.read_text());pages[str(p.relative_to(root))]=doc
def target(url,base):
 z=urlsplit(urljoin(base,url))
 if z.netloc!='seo-moldova.github.io':return None,None
 rel=unquote(z.path).lstrip('/') or 'index.html'
 return rel,z.fragment
for rel,d in pages.items():
 base=origin+'/'+rel
 for link in d.links:
  path,fragment=target(link,base)
  if path is None:continue
  if not (root/path).exists():errors.append([rel,'missing target',link]);continue
  if fragment and path in pages and fragment not in pages[path].ids:errors.append([rel,'missing anchor',link])
 for raw in d.scripts:
  try:json.loads(raw)
  except Exception as e:errors.append([rel,'invalid JSON-LD',str(e)])
 if d.scripts:
  definitions={};refs=[]
  def walk_schema(value):
   if isinstance(value,dict):
    if '@id' in value:
     if len(value)>1:
      if value['@id'] in definitions: errors.append([rel,'duplicate schema id',value['@id']])
      definitions[value['@id']]=value
     else: refs.append(value['@id'])
    for child in value.values(): walk_schema(child)
   elif isinstance(value,list):
    for child in value: walk_schema(child)
  for raw in d.scripts: walk_schema(json.loads(raw))
  for ref in refs:
   if ref.startswith(origin) and ref not in definitions: errors.append([rel,'unresolved schema reference',ref])
  if 'noindex' not in d.robots and origin+'/#website' not in definitions: errors.append([rel,'missing WebSite entity'])
 if 'noindex' not in d.robots:
  if not d.canonical:errors.append([rel,'missing canonical'])
  if d.h1!=1:errors.append([rel,'h1 count',d.h1])
  if not d.description:errors.append([rel,'missing description'])
 for lang,u in d.alt.items():
  path,_=target(u,base)
  if path not in pages:errors.append([rel,'missing hreflang',u]);continue
  if lang!='x-default' and pages[path].lang!=lang:errors.append([rel,'hreflang language mismatch',u])
  if d.lang in pages[path].alt and pages[path].alt[d.lang]!=d.canonical:errors.append([rel,'non reciprocal alternate',u])
sitemap=[x.text for x in ET.fromstring((root/'sitemap.xml').read_text()).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
for u in sitemap:
 rel,_=target(u,origin+'/')
 if rel not in pages:errors.append(['sitemap','missing page',u])
 elif pages[rel].canonical!=u:errors.append(['sitemap','canonical mismatch',u])
 elif 'noindex' in pages[rel].robots:errors.append(['sitemap','noindex',u])
for lang,rel in [('ru','index.html'),('ro','ro/index.html'),('en','en/index.html')]:
 s=(root/rel).read_text()
 if s.count('class="service-item"')!=6:errors.append([rel,'service count'])
 if s.index('featured-work')>s.index('home-services') or s.index('home-services')>s.index('home-about'):errors.append([rel,'section order'])
 if not re.search(r'class="hero-cv-link"',s):errors.append([rel,'CV unexpectedly removed'])
 p=(root/({'ru':'projects.html','ro':'ro/projects.html','en':'en/projects.html'}[lang])).read_text()
 if p.count('data-service="seo"')!=12 or p.count('data-service="ppc"')!=1:errors.append([rel,'case filter population'])
 for slug in ['google-ads','geo']:
  u=f'{origin}/services/{lang}/{slug}.html'
  if u not in sitemap:errors.append([u,'not in sitemap'])
result={'html_files':len(pages),'sitemap_urls':len(sitemap),'errors':errors}
(root/'reports/STATIC_CHECKS.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False))
raise SystemExit(bool(errors))
