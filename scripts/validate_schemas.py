#!/usr/bin/env python3
from __future__ import annotations
import json
from pathlib import Path
import sys

from jsonschema import Draft202012Validator, RefResolver

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'python'))
from shengzhou.core import build_demo_state, build_package  # noqa: E402

schemas={p.name:json.loads(p.read_text(encoding='utf-8')) for p in (ROOT/'schemas').glob('*.json')}
base_uri=(ROOT/'schemas').as_uri()+'/'
resolver=RefResolver(base_uri=base_uri,referrer=schemas['state.schema.json'],store={base_uri+k:v for k,v in schemas.items()})
state=build_demo_state();package=build_package(state)
checks=[]
for name,obj in [('state.schema.json',state),('package.schema.json',package),('profile.schema.json',state['profile'])]:
    validator=Draft202012Validator(schemas[name],resolver=resolver)
    errors=sorted(validator.iter_errors(obj),key=lambda e:list(e.path))
    checks.append({'schema':name,'valid':not errors,'errors':[e.message for e in errors]})
receipt_schema=schemas['receipt.schema.json']
for receipt in state['receipts']:
    errors=list(Draft202012Validator(receipt_schema).iter_errors(receipt))
    checks.append({'schema':'receipt.schema.json','valid':not errors,'errors':[e.message for e in errors]})
result={'version':'28.0.0','checks':checks,'passed':all(x['valid'] for x in checks)}
(ROOT/'release').mkdir(exist_ok=True)
(ROOT/'release'/'SCHEMA_VALIDATION.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
if not result['passed']:raise SystemExit(1)
