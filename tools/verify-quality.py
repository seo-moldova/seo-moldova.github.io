"""Source-only URL inventory and internal link graph. Rendered checks are separate evidence."""
from pathlib import Path
from lxml import html
from collections import Counter,defaultdict,deque
from urllib.parse import urljoin,urlsplit
import csv,json
root=Path(__file__).resolve().parents[1];origin='https://seo-moldova.github.io';out=root/'reports/quality/2026-11-18';out.mkdir(parents=True,exist_ok=True)
pages={};links={};incoming=Counter();titles=defaultdict(list)
for p in root.rglob('*.html'):
 d=html.fromstring(p.read_text());canon=d.xpath('//link[@rel="canonical"]/@href')
 if not canon or any('noindex' in x for x in d.xpath('//meta[@name="robots"]/@content')):continue
 path=urlsplit(canon[0]).path;pages[path]=(p,d)
for path,(p,d) in pages.items():
 links[path]=set();titles[d.xpath('//title/text()')[0]].append(path)
 for href in d.xpath('//a/@href'):
  u=urlsplit(urljoin(origin+path,href));dest=u.path
  if dest=='/index.html':dest='/'
  if u.netloc==urlsplit(origin).netloc and dest in pages and dest!=path:links[path].add(dest)
 for dest in links[path]:incoming[dest]+=1
q=deque(['/']);depth={'/':0}
while q:
 path=q.popleft()
 for dest in links[path]:
  if dest not in depth:depth[dest]=depth[path]+1;q.append(dest)
assert set(depth)==set(pages),sorted(set(pages)-set(depth))
assert not [v for v in titles.values() if len(v)>1]
with (out/'url-inventory.csv').open('w',newline='') as f:
 fields=['url','language','title','h1','description','canonical','robots','depth','incoming_pages','outgoing_pages','schema_types']
 w=csv.DictWriter(f,fieldnames=fields,lineterminator="\n");w.writeheader()
 for path,(p,d) in sorted(pages.items()):
  schemas=[json.loads(s) for s in d.xpath('//script[@type="application/ld+json"]/text()')];types=[n.get('@type') for s in schemas for n in s.get('@graph',[s])]
  w.writerow(dict(url=origin+path,language=d.get('lang'),title=d.xpath('//title/text()')[0],h1=' '.join(d.xpath('//h1')[0].text_content().split()),description=d.xpath('//meta[@name="description"]/@content')[0],canonical=d.xpath('//link[@rel="canonical"]/@href')[0],robots=';'.join(d.xpath('//meta[@name="robots"]/@content')) or 'default index/follow',depth=depth[path],incoming_pages=incoming[path],outgoing_pages=len(links[path]),schema_types=';'.join(types)))
summary={'indexable_pages':len(pages),'reachable_pages':len(depth),'orphans':[],'max_click_depth':max(depth.values()),'duplicate_titles':[],'min_incoming_pages':min(incoming[p] for p in pages)}
(out/'source-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary))
