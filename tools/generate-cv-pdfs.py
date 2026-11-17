"""Build the downloadable CVs from the same localized HTML content."""
from pathlib import Path
from html import escape
import re
from lxml import html
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
root=Path(__file__).resolve().parents[1]
pdfmetrics.registerFont(TTFont('CV','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('CVBold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
W,H=595.28,841.89
navy=HexColor('#191e36');blue=HexColor('#4361ee');muted=HexColor('#5a5a6e')
def clean(t):return re.sub(r'[\U00010000-\U0010ffff\u2600-\u27bf\ufe0f]', '', ' '.join(t.split())).strip()
for lang,source,target in [('ru','cv.html','ivan-pridorojnov-cv.pdf'),('ro','cv2.html','ivan-pridorojnov-ro.pdf'),('en','cv3.html','ivan-pridorojnov-en.pdf')]:
 doc=html.fromstring((root/source).read_text());c=canvas.Canvas(str(root/'cv'/target),pagesize=(W,H));c.setTitle('Ivan Pridorojnov — CV — '+lang.upper());c.setAuthor('Ivan Pridorojnov')
 c.setFillColor(navy);c.roundRect(28,H-113,W-56,113,15,fill=1,stroke=0)
 c.setFillColor(white);c.setFont('CVBold',19);c.drawString(45,H-36,clean(doc.xpath('//h1')[0].text_content()))
 photo=Image.open(root/'images/ivan-pridorojnov.webp');c.saveState();path=c.beginPath();path.circle(352,H-56,29);c.clipPath(path,stroke=0);c.drawImage(ImageReader(photo),323,H-100,58,87,mask='auto');c.restoreState()
 c.setFont('CV',8);c.drawString(45,H-56,clean(doc.xpath('//div[@class="cv-subtitle"]')[0].text_content()));c.drawString(45,H-74,clean(doc.xpath('//div[@class="cv-location"]')[0].text_content()))
 for i,(label,url) in enumerate([('ipridorojnov@gmail.com','mailto:ipridorojnov@gmail.com'),('Telegram: @Iezuit','https://t.me/Iezuit'),('seo-moldova.github.io','https://seo-moldova.github.io/')]):
  y=H-35-i*20;c.drawRightString(W-45,y,label);c.linkURL(url,(W-195,y-3,W-44,y+10),relative=0)
 def para(t,x,y,width,size=8.1,bold=False,color=muted,space=7):
  style=ParagraphStyle('p',fontName='CVBold' if bold else 'CV',fontSize=size,leading=size*1.38,textColor=color)
  p=Paragraph(escape(clean(t)),style);_,h=p.wrap(width,1000);p.drawOn(c,x,y-h);return y-h-space
 def heading(t,x,y,width):
  y=para(t,x,y,width,9,True,blue,6);c.setStrokeColor(HexColor('#e5e9f0'));c.line(x,y,x+width,y);return y-12
 x=45;width=177;y=H-143
 left=doc.xpath('//div[@class="cv-left"]/div[@class="cv-section"]')
 for section in left:
  y=heading(section.xpath('./h2')[0].text_content(),x,y,width)
  for e in section.xpath('./p|./ul/li'):y=para(e.text_content(),x,y,width,7.6,space=6)
  tools=section.xpath('.//div[@class="tool-item"]')
  for i in range(0,len(tools),2):
   ys=[para(t.text_content(),x+j*90,y,85,6.8,space=6) for j,t in enumerate(tools[i:i+2])];y=min(ys)
  y-=12
 assert y>28,(lang,'left',y)
 x=251;width=W-x-45;y=H-143
 c.setStrokeColor(HexColor('#e5e9f0'));c.line(235,45,235,H-143)
 right=doc.xpath('//div[@class="cv-right"]/div[@class="cv-section"]')
 y=heading(right[0].xpath('./h2')[0].text_content(),x,y,width)
 for job in right[0].xpath('./div[@class="experience-item"]'):
  y=para(job.xpath('./h3')[0].text_content(),x,y,width,8.8,True,navy,3)
  y=para(job.xpath('./div[@class="company"]')[0].text_content(),x,y,width,7.3,color=blue,space=3)
  y=para(job.xpath('./div[@class="period"]')[0].text_content(),x,y,width,6.8,space=5)
  y=para(job.xpath('./p')[0].text_content(),x,y,width,7.4,space=12)
 y=heading(right[1].xpath('./h2')[0].text_content(),x,y,width)
 y=para(' · '.join(e.text_content() for e in right[1].xpath('.//span[@class="skill-tag"]')),x,y,width,7)
 assert y>28,(lang,'right',y)
 c.save();print(target,'generated; remaining space',round(y))
