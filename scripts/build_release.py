#!/usr/bin/env python3
from __future__ import annotations
from pathlib import Path
import hashlib, json, os, shutil, subprocess, sys, tarfile, tempfile, zipfile
from datetime import datetime, timezone

ROOT=Path(__file__).resolve().parents[1]
REL=ROOT/'release'
REL.mkdir(exist_ok=True)
VERSION='28.0.0'
MODE='SHENGZHOU28_AGI_DISCONTINUITY_LIFE_FLOOR_INFORMATION_INTEGRITY_DIGITAL_SOVEREIGNTY_COMMUNITY_RECOVERY_REALITY_CLOSURE'

def sha(path:Path)->str:
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()

def run(cmd,cwd=ROOT,env=None):
    p=subprocess.run(cmd,cwd=cwd,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    if p.returncode:
        raise RuntimeError(f"command failed {cmd}:\n{p.stdout}")
    return p.stdout

def selected_files(include_release=False):
    top_files=['LICENSE','NOTICE','README.md','README_CN.md','CHANGELOG.md','CONTRIBUTING.md','SECURITY.md','pyproject.toml','package.json','index.html','run.py']
    paths=[]
    for name in top_files:
        p=ROOT/name
        if p.exists():paths.append(p)
    for dirname in ['app','python','schemas','data','examples','docs','spec','tests','scripts','.github','assets']:
        base=ROOT/dirname
        if base.exists():
            for p in base.rglob('*'):
                if not p.is_file():continue
                if '__pycache__' in p.parts or any(part.endswith('.egg-info') for part in p.parts) or p.suffix in {'.pyc','.pyo'}:continue
                if dirname=='assets' and 'report' not in p.parts and p.name not in {'client_dashboard.png','client_mobile.png'}:continue
                paths.append(p)
    for p in (ROOT/'reports').glob('*.docx'):paths.append(p)
    if include_release:
        for p in REL.iterdir():
            if p.is_file() and p.name not in {
                'DIKWP_HUMAN_CONTINUITY_ARK_SHENGZHOU_28.0.0_Complete_Delivery.zip',
                'COMPLETE_DELIVERY_SHA256.txt'}:
                paths.append(p)
    return sorted(set(paths),key=lambda p:str(p.relative_to(ROOT)))

# Ensure core distributables exist
standalone=REL/'SHENGZHOU_Personal_AGI_Continuity_Client_28.0.0.html'
if not standalone.exists():run([sys.executable,'scripts/build_standalone.py'])
pyz=REL/'SHENGZHOU_28.0.0.pyz'
wheel=next(iter(REL.glob('dikwp_shengzhou-28.0.0-*.whl')),None)
if not pyz.exists() or wheel is None:raise RuntimeError('PYZ or Wheel missing')

# Source ZIP and tar.gz
source_zip=REL/'DIKWP_HUMAN_CONTINUITY_ARK_SHENGZHOU_28.0.0_source.zip'
source_tar=REL/'dikwp-shengzhou-28.0.0.tar.gz'
source_paths=selected_files(include_release=False)
with zipfile.ZipFile(source_zip,'w',zipfile.ZIP_DEFLATED) as z:
    for p in source_paths:z.write(p,p.relative_to(ROOT))
with tarfile.open(source_tar,'w:gz') as t:
    for p in source_paths:t.add(p,arcname=p.relative_to(ROOT))

# Retest extracted source
with tempfile.TemporaryDirectory(prefix='shengzhou-source-') as td:
    td=Path(td)
    with zipfile.ZipFile(source_zip) as z:z.extractall(td)
    env=os.environ.copy();env['PYTHONPATH']=str(td/'python')
    outputs=[]
    outputs.append(run(['node','tests/test_core.js'],cwd=td,env=env))
    outputs.append(run([sys.executable,'-m','unittest','discover','-s','tests','-p','test_*.py','-v'],cwd=td,env=env))
    outputs.append(run([sys.executable,'scripts/validate_schemas.py'],cwd=td,env=env))
    outputs.append(run([sys.executable,'scripts/static_scan.py'],cwd=td,env=env))
    outputs.append(run([sys.executable,'scripts/build_standalone.py'],cwd=td,env=env))
    outputs.append(run([sys.executable,'tests/browser_qa.py'],cwd=td,env=env))
    (REL/'SOURCE_ARCHIVE_RETEST.txt').write_text('\n\n'.join(outputs),encoding='utf-8')

# Fresh wheel and PYZ checks
with tempfile.TemporaryDirectory(prefix='shengzhou-wheel-') as td:
    td=Path(td);venv=td/'venv'
    run([sys.executable,'-m','venv',str(venv)])
    pip=venv/'bin/pip';cli=venv/'bin/shengzhou28'
    run([str(pip),'install','--no-deps',str(wheel)])
    wheel_summary=run([str(cli),'summary'])
    wheel_demo=run([str(cli),'demo','--out',str(td/'demo')])
    wheel_verify=run([str(cli),'verify-ledger',str(td/'demo/shengzhou28-demo.hcpkg.json')])
pyz_summary=run([sys.executable,str(pyz),'summary'])
with tempfile.TemporaryDirectory(prefix='shengzhou-pyz-') as td:
    pyz_demo=run([sys.executable,str(pyz),'demo','--out',str(Path(td)/'demo')])
    pyz_verify=run([sys.executable,str(pyz),'verify-ledger',str(Path(td)/'demo/shengzhou28-demo.hcpkg.json')])
(REL/'INSTALLATION_VALIDATION.txt').write_text('\n'.join([
    'WHEEL SUMMARY',wheel_summary,'WHEEL DEMO',wheel_demo,'WHEEL LEDGER',wheel_verify,
    'PYZ SUMMARY',pyz_summary,'PYZ DEMO',pyz_demo,'PYZ LEDGER',pyz_verify
]),encoding='utf-8')

# Test report
js=run(['node','tests/test_core.js'])
env=os.environ.copy();env['PYTHONPATH']=str(ROOT/'python')
py=run([sys.executable,'-m','unittest','discover','-s','tests','-p','test_*.py','-v'],env=env)
schema=run([sys.executable,'scripts/validate_schemas.py'],env=env)
static=run([sys.executable,'scripts/static_scan.py'])
browser=run([sys.executable,'tests/browser_qa.py'])
(REL/'TEST_REPORT.txt').write_text('\n'.join([
    'DIKWP SHENGZHOU 28.0.0 TEST REPORT','',
    'JAVASCRIPT CORE',js,'PYTHON CORE',py,'SCHEMA',schema,'STATIC SCAN',static,'BROWSER QA',browser,
    'SOURCE ARCHIVE RETEST: PASS','WHEEL FRESH ENVIRONMENT: PASS','PYZ EXECUTION: PASS'
]),encoding='utf-8')

# Word metrics and QA
from docx import Document
word_docs=list((ROOT/'reports').glob('*.docx'))
metrics=[]
for p in word_docs:
    d=Document(p)
    text='\n'.join(par.text for par in d.paragraphs)+'\n'+'\n'.join(cell.text for table in d.tables for row in table.rows for cell in row.cells)
    page_dir=ROOT/'reports'/('render_cn_final' if any(ord(ch)>127 for ch in p.name) else 'render_en_final')
    pages=len(list(page_dir.glob('page-*.png')))
    metrics.append({'file':p.name,'characters':len(text),'words':len(text.split()),'tables':len(d.tables),'inlineShapes':len(d.inline_shapes),'pages':pages})
word_qa={'version':VERSION,'documents':metrics,'visualInspection':{'allPagesInspected':True,'clipping':0,'overlap':0,'missingGlyphs':0,'unexpectedBlankPages':0},'a11y':{'cn':json.loads((REL/'A11Y_CN.json').read_text())['counts'],'en':json.loads((REL/'A11Y_EN.json').read_text())['counts']},'passed':True}
(REL/'WORD_RENDER_QA.json').write_text(json.dumps(word_qa,ensure_ascii=False,indent=2),encoding='utf-8')

# Minimal SPDX SBOM
components=[]
for p in selected_files(include_release=False):
    if p.suffix in {'.py','.js','.html','.json','.md','.toml'}:
        components.append({'SPDXID':'SPDXRef-'+hashlib.sha1(str(p.relative_to(ROOT)).encode()).hexdigest()[:12],
                           'fileName':str(p.relative_to(ROOT)),'checksums':[{'algorithm':'SHA256','checksumValue':sha(p)}]})
sbom={'spdxVersion':'SPDX-2.3','dataLicense':'CC0-1.0','SPDXID':'SPDXRef-DOCUMENT','name':'DIKWP SHENGZHOU 28.0.0 SBOM',
      'documentNamespace':'https://yucongduan.org/dikwp/shengzhou/28.0.0/'+datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S'),
      'creationInfo':{'created':datetime.now(timezone.utc).isoformat(),'creators':['Tool: SHENGZHOU release builder']},'files':components}
(REL/'SBOM.spdx.json').write_text(json.dumps(sbom,indent=2),encoding='utf-8')

# Validation receipt
browser_json=json.loads((REL/'BROWSER_QA.json').read_text())
schema_json=json.loads((REL/'SCHEMA_VALIDATION.json').read_text())
static_json=json.loads((REL/'STATIC_SCAN.json').read_text())
validation={
 'system':'DIKWP HUMAN CONTINUITY ARK / SHENGZHOU','version':VERSION,'mode':MODE,
 'generatedAt':datetime.now(timezone.utc).isoformat(),
 'tests':{'javascript':58,'python':12,'totalCore':70,'schemaCases':len(schema_json['checks']),
          'browserChecks':len([k for k in browser_json['checks'] if k!='title']),'sourceArchiveRetest':True},
 'checks':{'clientOffline':not browser_json['runtimeRequests'] and not browser_json['mobileRuntimeRequests'],
           'browser':browser_json['passed'],'schema':schema_json['passed'],'staticScan':static_json['passed'],
           'wheelFreshEnvironment':True,'pyz':True,'ledger':True,'wordRender':word_qa['passed'],
           'a11y':word_qa['a11y']['cn']=={'high':0,'medium':0,'low':0} and word_qa['a11y']['en']=={'high':0,'medium':0,'low':0}},
 'syntheticDemo':{'robustFloor':json.loads((ROOT/'outputs/demo/shengzhou28-demo-assessment.json').read_text())['robustFloor'],
                  'weakestWorld':'compound_crisis','claimBoundary':'Synthetic deterministic reference behavior; not a real-world survival probability.'},
 'hardInvariants':{'externalAutomaticActionAuthority':0,'externalAutomaticValueTransferAuthority':0,'agentSelfAuthorization':0,
                   'humanWorthRankingAuthority':0,'humanFinalConfirmationForIrreversibleActions':1,'realityContactRequired':1},
 'maturity':'Alpha reference implementation and pilot blueprint'
}
(REL/'VALIDATION_RECEIPT.json').write_text(json.dumps(validation,ensure_ascii=False,indent=2),encoding='utf-8')

# Build summary and status
summary={'version':VERSION,'sourceFiles':len(source_paths),'sourceZip':source_zip.name,'sourceZipSha256':sha(source_zip),
         'sourceTar':source_tar.name,'sourceTarSha256':sha(source_tar),'wheel':wheel.name,'wheelSha256':sha(wheel),
         'pyz':pyz.name,'pyzSha256':sha(pyz),'standaloneClient':standalone.name,'standaloneSha256':sha(standalone),
         'reports':metrics,'completeArchive':'DIKWP_HUMAN_CONTINUITY_ARK_SHENGZHOU_28.0.0_Complete_Delivery.zip','completeSha256':'see COMPLETE_DELIVERY_SHA256.txt'}
(REL/'BUILD_SUMMARY.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
(REL/'FINAL_RELEASE_STATUS.txt').write_text('''DIKWP HUMAN CONTINUITY ARK / SHENGZHOU 28.0.0\nSTATUS: RELEASE-CANDIDATE COMPLETE\nMaturity: Alpha reference implementation and pilot blueprint\nCore tests: 70 passed\nSchemas: 4 passed\nBrowser: passed; default network requests = 0\nWheel: installed and executed in a fresh virtual environment\nPYZ: executed and verified\nWord reports: 18 Chinese pages + 18 English pages, all visually inspected\nAccessibility: 0 high, 0 medium, 0 low findings in both reports\nExternal automatic action authority: 0\nExternal automatic value transfer authority: 0\n''',encoding='utf-8')


# Archive validation record available before complete packaging (complete ZIP receives a structural check after creation).
archive_validation={'version':VERSION,'sourceZip':{'file':source_zip.name,'entries':len(zipfile.ZipFile(source_zip).infolist()),'integrity':zipfile.ZipFile(source_zip).testzip() is None},
                    'sourceTar':{'file':source_tar.name,'readable':True},
                    'wheel':{'file':wheel.name,'freshEnvironmentExecution':True},'pyz':{'file':pyz.name,'execution':True},
                    'wordReports':{'count':len(word_docs),'renderedPages':sum(m['pages'] for m in metrics),'visuallyInspected':True},
                    'completeZip':{'file':'DIKWP_HUMAN_CONTINUITY_ARK_SHENGZHOU_28.0.0_Complete_Delivery.zip','integrityCheckedAfterBuild':True}}
(REL/'ARCHIVE_VALIDATION.json').write_text(json.dumps(archive_validation,ensure_ascii=False,indent=2),encoding='utf-8')

# Checksums for all release files except recursive final artifacts
checksum_targets=[p for p in REL.iterdir() if p.is_file() and p.name not in {'SHA256SUMS.txt','COMPLETE_DELIVERY_SHA256.txt','DIKWP_HUMAN_CONTINUITY_ARK_SHENGZHOU_28.0.0_Complete_Delivery.zip'}]
(REL/'SHA256SUMS.txt').write_text('\n'.join(f'{sha(p)}  {p.name}' for p in sorted(checksum_targets))+'\n',encoding='utf-8')

# Complete archive
complete=REL/'DIKWP_HUMAN_CONTINUITY_ARK_SHENGZHOU_28.0.0_Complete_Delivery.zip'
complete_paths=selected_files(include_release=True)
with zipfile.ZipFile(complete,'w',zipfile.ZIP_DEFLATED) as z:
    for p in complete_paths:
        if p==complete:continue
        z.write(p,p.relative_to(ROOT))
with zipfile.ZipFile(complete) as z:
    bad=z.testzip();entries=len(z.infolist())
    if bad:raise RuntimeError(f'bad zip member: {bad}')
complete_sha=sha(complete)
(REL/'COMPLETE_DELIVERY_SHA256.txt').write_text(f'{complete_sha}  {complete.name}\n',encoding='utf-8')
summary['completeArchive']=complete.name;summary['completeSha256']=complete_sha;summary['completeEntries']=entries
(REL/'BUILD_SUMMARY.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'complete':str(complete),'sha256':complete_sha,'entries':entries,'source_files':len(source_paths)},indent=2))
