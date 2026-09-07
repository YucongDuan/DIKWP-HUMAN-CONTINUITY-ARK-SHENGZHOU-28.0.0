#!/usr/bin/env python3
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
index=(ROOT/'index.html').read_text(encoding='utf-8')
css=(ROOT/'app'/'styles.css').read_text(encoding='utf-8')
core=(ROOT/'app'/'core.js').read_text(encoding='utf-8')
app=(ROOT/'app'/'app.js').read_text(encoding='utf-8')
html=index.replace('<link rel="stylesheet" href="app/styles.css">',f'<style>\n{css}\n</style>')
html=html.replace('<script src="app/core.js"></script>',f'<script>\n{core}\n</script>')
html=html.replace('<script src="app/app.js"></script>',f'<script>\n{app}\n</script>')
out=ROOT/'release'/'SHENGZHOU_Personal_AGI_Continuity_Client_28.0.0.html'
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(html,encoding='utf-8')
print(out)
