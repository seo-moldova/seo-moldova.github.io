"""Record one selected task after checking its evidence. Never invent plan IDs."""
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import argparse,re

p=argparse.ArgumentParser()
p.add_argument('task');p.add_argument('status',choices=['done','blocked','deferred'])
p.add_argument('result');p.add_argument('verification')
a=p.parse_args()
root=Path(__file__).resolve().parents[1]
plan=root/'ACTION_PLAN.md';s=plan.read_text()
pattern=rf'^- \[[ x]\] \*\*{re.escape(a.task)}\*\* — (.+)$'
m=re.search(pattern,s,re.M)
if not m:raise SystemExit('Task is not in the selected plan')
if a.status=='done':
 s=re.sub(pattern,lambda m:f'- [x] **{a.task}** — {m.group(1)}',s,flags=re.M)
 plan.write_text(s)
stamp=datetime.now(ZoneInfo('Europe/Chisinau')).isoformat(timespec='minutes')
status={'done':'Выполнено','blocked':'Недоступно','deferred':'Отложено по условию'}[a.status]
with (root/'WORK_LOG.md').open('a') as f:
 f.write(f'## {a.task} — {status}\n\n{stamp}\n\nРезультат: {a.result}\n\nПроверка: {a.verification}\n\n')
print(f'{a.task}: {status}')
