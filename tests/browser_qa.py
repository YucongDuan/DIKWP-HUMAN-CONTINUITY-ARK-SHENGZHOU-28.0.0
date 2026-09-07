#!/usr/bin/env python3
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'release'/'SHENGZHOU_Personal_AGI_Continuity_Client_28.0.0.html').read_text(encoding='utf-8')
result={'version':'28.0.0','errors':[],'runtimeRequests':[],'checks':{}}
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000})
    page.on('console',lambda m: result['errors'].append({'type':m.type,'text':m.text}) if m.type=='error' else None)
    page.on('pageerror',lambda e: result['errors'].append({'type':'pageerror','text':str(e)}))
    page.on('request',lambda r: result['runtimeRequests'].append(r.url) if not r.url.startswith('data:') and not r.url.startswith('blob:') else None)
    page.set_content(html,wait_until='load',timeout=120000)
    page.wait_for_timeout(500)
    result['checks']['title']=page.title()
    result['checks']['views']=page.locator('.view').count()
    result['checks']['navButtons']=page.locator('#nav button').count()
    result['checks']['metricCards']=page.locator('#dashboardMetrics .metric').count()
    result['checks']['priorityActions']=page.locator('#priorityActions .action-item').count()
    page.screenshot(path=str(ROOT/'assets'/'client_dashboard.png'),full_page=True)

    page.click('[data-view="passport"]')
    page.fill('#p_displayName','Browser QA Household')
    page.fill('#p_jurisdiction','QA jurisdiction')
    page.fill('#p_localEmergencyNumber','Official number to verify')
    result['checks']['profileEdit']=page.evaluate('window.ShengzhouApp.getState().profile.displayName')=='Browser QA Household'

    page.click('[data-view="worlds"]')
    result['checks']['worldCards']=page.locator('#worldCards .world-card').count()
    page.locator('[data-world-severity="compound_crisis"]').fill('0.85')
    result['checks']['worldEdit']=abs(page.evaluate('window.ShengzhouApp.getState().worlds.find(x=>x.id==="compound_crisis").severity')-.85)<1e-9

    page.click('[data-view="floors"]')
    result['checks']['floorCards']=page.locator('#floorCards .floor-card').count()

    page.click('[data-view="kit"]')
    page.locator('[data-prep="waterDays"]').fill('3')
    page.locator('[data-prep="foodDays"]').fill('14')
    result['checks']['kitItems']=page.locator('#kitChecklist .kit-item').count()

    page.click('[data-view="trust"]')
    page.fill('#messageScanInput','紧急，不要告诉家人，马上转账并发送验证码。')
    page.click('#scanMessage')
    result['checks']['messageScan']='HIGH' in page.locator('#messageScanResult').inner_text()

    page.click('[data-view="information"]')
    page.fill('#sourceName','QA emergency authority')
    page.fill('#sourceChannel','official phone and site')
    page.click('#addSource')
    result['checks']['addSource']=page.locator('#sourceTable .list-row').count()>=1

    page.click('[data-view="authority"]')
    page.select_option('#aiActionType','transfer_money')
    page.click('#evaluateAi')
    result['checks']['aiFirewall']='HOLD' in page.locator('#aiResult').inner_text()

    page.click('[data-view="mobility"]')
    page.fill('#contactName','QA Contact')
    page.fill('#contactRole','out-of-area relay')
    page.fill('#contactChannels','paper record')
    page.click('#addContact')
    result['checks']['addContact']=page.locator('#contactTable .list-row').count()>=1

    page.click('[data-view="activation"]')
    page.locator('[data-signal="identity_takeover"]').check()
    result['checks']['activationMode']='L3' in page.locator('#activationMode').inner_text() or 'L4' in page.locator('#activationMode').inner_text()

    page.click('[data-view="drills"]')
    page.select_option('#drillType','identity')
    page.click('#buildDrill')
    result['checks']['drillGenerated']=len(page.locator('#drillOutput').inner_text())>200
    page.fill('#drillScenario','Synthetic identity recovery drill')
    page.fill('#drillResult','Recovery paths were found without changing real accounts.')
    page.fill('#drillRevision','Print one additional recovery contact.')
    page.click('#saveDrill')
    result['checks']['drillSaved']=page.locator('#drillTable .list-row').count()>=1

    page.click('[data-view="export"]')
    result['checks']['planLength']=len(page.locator('#planPreview').inner_text())>1500
    page.click('#verifyLedger')
    result['checks']['ledger']='有效' in page.locator('#ledgerStatus').inner_text()
    result['checks']['receiptCount']=len(page.evaluate('window.ShengzhouApp.getState().receipts'))>=5

    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    mobile_errors=[];mobile_requests=[]
    mobile.on('console',lambda m: mobile_errors.append({'type':m.type,'text':m.text}) if m.type=='error' else None)
    mobile.on('pageerror',lambda e: mobile_errors.append({'type':'pageerror','text':str(e)}))
    mobile.on('request',lambda r: mobile_requests.append(r.url) if not r.url.startswith('data:') and not r.url.startswith('blob:') else None)
    mobile.set_content(html,wait_until='load',timeout=120000);mobile.wait_for_timeout(400)
    mobile.click('#mobileMenu')
    result['checks']['mobileMenu']='open' in (mobile.locator('#sidebar').get_attribute('class') or '')
    mobile.screenshot(path=str(ROOT/'assets'/'client_mobile.png'),full_page=True)
    result['mobileErrors']=mobile_errors;result['mobileRuntimeRequests']=mobile_requests
    browser.close()

result['passed']=not result['errors'] and not result['mobileErrors'] and not result['runtimeRequests'] and not result['mobileRuntimeRequests'] and all(v for k,v in result['checks'].items() if k!='title')
(ROOT/'release'/'BROWSER_QA.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
if not result['passed']:raise SystemExit(1)
