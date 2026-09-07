#!/usr/bin/env python3
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
python_patterns={
  'python_dynamic_exec':r'\b(eval|exec)\s*\(',
  'python_process':r'\b(subprocess|os\.system|Popen)\b',
  'python_network':r'(^|\n)\s*(from\s+(requests|urllib\.request|httpx|socket)\s+import|import\s+(requests|urllib\.request|httpx|socket)\b)',
  'raw_packet':r'\bscapy\b|AF_PACKET|SOCK_RAW',
}
js_patterns={
  'js_dynamic_exec':r'\beval\s*\(|new\s+Function\s*\(',
  'js_network':r'\b(fetch|XMLHttpRequest|WebSocket)\s*\(',
  'raw_packet':r'\bscapy\b|AF_PACKET|SOCK_RAW',
}
files=list((ROOT/'app').glob('*.js'))+list((ROOT/'python'/'shengzhou').glob('*.py'))
findings=[]
for path in files:
    text=path.read_text(encoding='utf-8')
    patterns=python_patterns if path.suffix=='.py' else js_patterns
    for name,pat in patterns.items():
        for m in re.finditer(pat,text):
            findings.append({'file':str(path.relative_to(ROOT)),'pattern':name,'match':m.group(0),'offset':m.start()})
result={'version':'28.0.0','filesScanned':len(files),'findings':findings,'passed':not findings}
(ROOT/'release'/'STATIC_SCAN.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
if findings:raise SystemExit(1)
