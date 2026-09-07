(function(){
'use strict';
const Core=window.ShengzhouCore;
const KEY='dikwp-shengzhou-28-state';
let state=loadState();
let currentView='dashboard';

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const pct=v=>`${Math.round(Core.clamp(v)*100)}%`;
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2200);}
function loadState(){
  try{const raw=localStorage.getItem(KEY);return raw?Core.normalizeState(JSON.parse(raw)):Core.normalizeState(Core.DEFAULT_STATE);}catch(e){return Core.normalizeState(Core.DEFAULT_STATE);}
}
function saveState(message='已保存到本浏览器'){state.meta.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state));toast(message);}catch(e){toast('当前浏览器限制本地存储，请导出备份');}}
function addReceipt(type,payload){const out=Core.createReceipt(state,type,payload);state=out.state;return out.receipt;}
function setView(id){
  if(!document.getElementById(id))return;
  currentView=id;$$('.view').forEach(v=>v.classList.toggle('active',v.id===id));$$('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  $('#sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});renderCurrent();
}
function bindNavigation(){
  $$('#nav button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  $$('[data-jump]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.jump)));
  $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
}
function field(id,key,type='text'){
  const el=$(`#${id}`);if(!el)return;
  const v=state.profile[key];if(type==='checkbox')el.checked=!!v;else el.value=v??'';
  const ev=type==='checkbox'?'change':'input';el.addEventListener(ev,()=>{state.profile[key]=type==='checkbox'?el.checked:(type==='number'?Number(el.value):el.value);state.meta.updatedAt=new Date().toISOString();renderLight();});
}
function bindProfile(){
  const specs=[['p_displayName','displayName'],['p_jurisdiction','jurisdiction'],['p_language','language'],['p_homeType','homeType'],['p_householdSize','householdSize','number'],['p_children','children','number'],['p_olderAdults','olderAdults','number'],['p_pets','pets','number'],['p_disabilityOrMedicalDependency','disabilityOrMedicalDependency','checkbox'],['p_transport','transport'],['p_essentialMonthlyCost','essentialMonthlyCost','number'],['p_localEmergencyNumber','localEmergencyNumber'],['p_nearestSafePlace','nearestSafePlace'],['p_outOfAreaContactName','outOfAreaContactName'],['p_outOfAreaContactPhone','outOfAreaContactPhone'],['p_meetingPointNear','meetingPointNear'],['p_meetingPointFar','meetingPointFar'],['p_verificationHint','verificationHint'],['p_notes','notes']];
  specs.forEach(x=>field(...x));
}
function bindPreparedness(){
  $$('[data-prep]').forEach(el=>{
    const k=el.dataset.prep,v=state.preparedness[k];
    if(el.type==='checkbox')el.checked=!!v;else el.value=v??0;
    if(el.type==='range'){const out=el.closest('.range-row')?.querySelector('output');if(out)out.textContent=pct(v);}
    const ev=el.type==='checkbox'?'change':'input';
    el.addEventListener(ev,()=>{state.preparedness[k]=el.type==='checkbox'?el.checked:Number(el.value);if(el.type==='range'){const out=el.closest('.range-row')?.querySelector('output');if(out)out.textContent=pct(el.value);}renderLight();});
  });
}
function renderLight(){
  $('#householdTitle').textContent=state.profile.displayName||'我的家庭';
  if(currentView==='passport')renderPassport();
  if(currentView==='floors')renderFloors();
  if(currentView==='kit')renderKit();
  if(currentView==='activation')renderActivation();
  if(currentView==='export')renderExport();
}
function scoreClass(v){return v>=.75?'good':v>=.48?'warn':'bad';}
function metric(label,value,sub='',cls=''){return `<div class="metric ${cls}"><span class="label">${esc(label)}</span><div class="value">${esc(value)}</div><div class="sub">${esc(sub)}</div></div>`;}
function renderDashboard(){
  const sum=Core.readinessSummary(state),mode=Core.triggerMode(state.signals),actions=Core.getPriorityActions(state,6);
  const kitDone=Core.buildKitList(state).filter(x=>x.done).length;
  const receipts=Core.verifyReceipts(state.receipts);
  $('#dashboardMetrics').innerHTML=[
    metric('跨世界最低底线',pct(sum.robustFloor),'仅作准备信号，不是生存概率',scoreClass(sum.robustFloor)),
    metric('基线最弱能力',Core.DOMAINS.find(d=>d.id===sum.weakestBase[0].id)?.short||sum.weakestBase[0].id,pct(sum.weakestBase[0].score),scoreClass(sum.weakestBase[0].score)),
    metric('当前模式',`L${mode.level}`,mode.name,mode.level>=3?'bad':mode.level>=1?'warn':'good'),
    metric('72小时清单',`${kitDone}/10`,'动态家庭清单',kitDone>=8?'good':kitDone>=5?'warn':'bad'),
    metric('回执链',receipts.valid?'有效':'异常',`${receipts.count||0}条本地回执`,receipts.valid?'good':'bad')
  ].join('');
  $('#priorityActions').innerHTML=actions.length?actions.map((a,i)=>`<div class="action-item"><div class="num">${i+1}</div><div><h4>${esc(a.title)}</h4><p>${esc(a.steps[0])}</p></div><span class="tag">${esc(a.domainName)}</span></div>`).join(''):'<div class="result-box good">当前规则未发现新的准备缺口；仍需定期演练和核验本地变化。</div>';
  $('#worldPressure').innerHTML=sum.worlds.slice().sort((a,b)=>a.floor-b.floor).map(w=>`<div class="bar-row"><span class="name">${esc(w.name)}</span><div class="progress"><span style="width:${pct(w.floor)}"></span></div><span class="score">${pct(w.floor)}</span></div>`).join('');
  $('#modeName').textContent=`L${mode.level} · ${mode.name}`;$('#modeInstruction').textContent=mode.instruction;
  $('#modeActions').innerHTML=Core.emergencyActions(mode.level).slice(0,5).map(x=>`<div>${esc(x)}</div>`).join('');
}
function renderPassport(){
  const p=state.profile;const checks=[p.displayName,p.jurisdiction,p.householdSize,p.localEmergencyNumber,p.nearestSafePlace,p.outOfAreaContactName,p.meetingPointNear,p.meetingPointFar];const complete=checks.filter(v=>String(v??'').trim()).length/checks.length;
  $('#passportStatus').innerHTML=`<div class="status-line"><span>关键字段</span><b>${pct(complete)}</b></div><div class="progress"><span style="width:${pct(complete)}"></span></div><p class="note">护照完整不代表准备完成；它只说明家庭责任、会合和恢复路径是否已经被显式写出。</p>`;
}
function renderWorlds(){
  const results=Core.worldResults(state);
  $('#worldCards').innerHTML=Core.WORLDS.map((w,i)=>{
    const st=state.worlds.find(x=>x.id===w.id)||{weight:w.weight,severity:1};const r=results.find(x=>x.id===w.id);
    return `<article class="panel world-card"><div class="world-head"><div><span class="kicker">WORLD ${String(i+1).padStart(2,'0')}</span><h3>${esc(w.name)}</h3></div><b class="weight-value">底线 ${pct(r.floor)}</b></div><p>${esc(w.description)}</p><div class="field"><label>规划权重</label><div class="range-row"><input type="range" min="0" max="0.5" step="0.01" data-world-weight="${w.id}" value="${st.weight}"><output>${Math.round(st.weight*100)}%</output></div></div><div class="field"><label>压力强度</label><div class="range-row"><input type="range" min="0" max="1" step="0.01" data-world-severity="${w.id}" value="${st.severity}"><output>${pct(st.severity)}</output></div></div><div class="weak-list">${r.weakest.map(x=>`<span>${esc(Core.DOMAINS.find(d=>d.id===x.id)?.short||x.id)} ${pct(x.score)}</span>`).join('')}</div></article>`;
  }).join('');
  $$('[data-world-weight]').forEach(el=>el.addEventListener('input',()=>{const w=state.worlds.find(x=>x.id===el.dataset.worldWeight);w.weight=Number(el.value);el.closest('.range-row').querySelector('output').textContent=Math.round(w.weight*100)+'%';}));
  $$('[data-world-severity]').forEach(el=>el.addEventListener('input',()=>{const w=state.worlds.find(x=>x.id===el.dataset.worldSeverity);w.severity=Number(el.value);el.closest('.range-row').querySelector('output').textContent=pct(w.severity);}));
}
function renderFloors(){
  const sum=Core.readinessSummary(state);const minByDomain={};Core.DOMAINS.forEach(d=>minByDomain[d.id]=Math.min(...sum.worlds.map(w=>w.scores[d.id])));
  $('#floorCards').innerHTML=Core.DOMAINS.map((d,i)=>{const b=sum.base[d.id],m=minByDomain[d.id],weak=sum.worlds.slice().sort((a,b)=>a.scores[d.id]-b.scores[d.id])[0];return `<article class="panel floor-card"><span class="kicker">FLOOR ${String(i+1).padStart(2,'0')}</span><h3>${esc(d.name)}</h3><div class="big ${scoreClass(m)}">${pct(m)}</div><div class="status-line"><span>平时准备</span><b>${pct(b)}</b></div><div class="progress"><span style="width:${pct(m)}"></span></div><div class="weak-world">最弱于：${esc(weak.name)}</div></article>`;}).join('');
  const actions=Core.getPriorityActions(state,24);$('#allActions').innerHTML=actions.length?actions.map((a,i)=>`<div class="action-item"><div class="num">${i+1}</div><div><h4>${esc(a.title)}</h4><p>${a.steps.map(esc).join(' · ')}</p></div><span class="tag">${esc(a.effort)}</span></div>`).join(''):'<div class="result-box good">当前规则未发现未完成项。请通过演练验证，而不是只相信勾选状态。</div>';
}
function renderKit(){
  $('#kitChecklist').innerHTML=Core.buildKitList(state).map(x=>`<div class="kit-item ${x.done?'done':''}"><div class="check">${x.done?'✓':'·'}</div><div>${esc(x.item)}<small>${esc(x.category)}</small></div></div>`).join('');
}
function renderSources(){
  $('#sourceTable').innerHTML=state.trustedSources.length?`<div class="source-list">${state.trustedSources.map((x,i)=>`<div class="list-row"><b>${esc(x.name)}</b><span>${esc(x.channel)}</span><small>${esc(x.verifiedAt||'未标日期')}</small><button data-remove-source="${i}">删除</button></div>`).join('')}</div>`:'<div class="result-box">尚未登记来源。至少添加本地应急、健康、天气/公共安全和公用设施的官方入口。</div>';
  $$('[data-remove-source]').forEach(b=>b.addEventListener('click',()=>{state.trustedSources.splice(Number(b.dataset.removeSource),1);renderSources();}));
}
function renderContacts(){
  $('#contactTable').innerHTML=state.contacts.length?`<div class="contact-list">${state.contacts.map((x,i)=>`<div class="list-row"><b>${esc(x.name)}</b><span>${esc(x.role)}</span><small>${esc(x.channels)}</small><button data-remove-contact="${i}">删除</button></div>`).join('')}</div>`:'<div class="result-box">尚未登记互助联系人。建议建立至少三名不同技能和不同位置的联系人。</div>';
  $$('[data-remove-contact]').forEach(b=>b.addEventListener('click',()=>{state.contacts.splice(Number(b.dataset.removeContact),1);renderContacts();}));
}
function renderActivation(){
  $('#signalGrid').innerHTML=Core.SIGNALS.map(s=>`<label class="signal-card ${state.signals.includes(s.id)?'checked':''}"><input type="checkbox" data-signal="${s.id}" ${state.signals.includes(s.id)?'checked':''}><span><strong>${esc(s.label)}</strong><small>触发权重 ${s.points}</small></span></label>`).join('');
  $$('[data-signal]').forEach(el=>el.addEventListener('change',()=>{state.signals=el.checked?[...new Set([...state.signals,el.dataset.signal])]:state.signals.filter(x=>x!==el.dataset.signal);renderActivation();}));
  const mode=Core.triggerMode(state.signals);$('#activationMode').textContent=`L${mode.level} · ${mode.name}`;$('#activationInstruction').textContent=mode.instruction;$('#activationActions').innerHTML=Core.emergencyActions(mode.level).map(x=>`<div>${esc(x)}</div>`).join('');
}
function renderDrills(){
  $('#drillTable').innerHTML=state.drills.length?`<div class="drill-list">${state.drills.slice().reverse().map((d,i)=>`<div class="list-row"><b>${esc(d.date||'未标日期')}</b><span><strong>${esc(d.scenario)}</strong><br><small>${esc(d.result)}</small></span><small>${esc(d.revision)}</small><button data-remove-drill="${state.drills.length-1-i}">删除</button></div>`).join('')}</div>`:'<div class="result-box">尚无演练记录。请选择一个不制造真实风险的合成演练。</div>';
  $$('[data-remove-drill]').forEach(b=>b.addEventListener('click',()=>{state.drills.splice(Number(b.dataset.removeDrill),1);renderDrills();}));
}
function renderExport(){
  const card=Core.buildEmergencyCard(state);
  $('#printableCard').innerHTML=`<span class="kicker">OFFLINE CONTINUITY CARD</span><h3>${esc(card.title)}</h3><div class="card-grid"><div class="card-block"><b>家庭</b>${esc(card.household)} · ${esc(card.householdSize)}人<br>儿童 ${esc(card.dependents.children)} · 老人 ${esc(card.dependents.olderAdults)} · 宠物 ${esc(card.dependents.pets)}</div><div class="card-block"><b>当地入口</b>应急号码：${esc(card.emergencyNumber)}<br>最近安全地点：${esc(card.nearestSafePlace)}</div><div class="card-block"><b>会合点</b>近：${esc(card.meetingPoints[0])}<br>远：${esc(card.meetingPoints[1])}</div><div class="card-block"><b>外地中继</b>${esc(card.outOfAreaRelay.name)}<br>${esc(card.outOfAreaRelay.phone)}</div><div class="card-block"><b>身份核验</b>${esc(card.verification)}</div><div class="card-block"><b>当前模式</b>${esc(card.currentMode)}</div></div><h3>立即行动</h3><ul>${card.immediateActions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="card-warning">${esc(card.warning)}</div>`;
  $('#planPreview').textContent=Core.exportTextPlan(state);
}
function renderCurrent(){
  $('#householdTitle').textContent=state.profile.displayName||'我的家庭';
  if(currentView==='dashboard')renderDashboard();
  else if(currentView==='passport')renderPassport();
  else if(currentView==='worlds')renderWorlds();
  else if(currentView==='floors')renderFloors();
  else if(currentView==='kit')renderKit();
  else if(currentView==='information')renderSources();
  else if(currentView==='mobility')renderContacts();
  else if(currentView==='activation')renderActivation();
  else if(currentView==='drills')renderDrills();
  else if(currentView==='export')renderExport();
}
function renderAll(){renderDashboard();renderPassport();renderWorlds();renderFloors();renderKit();renderSources();renderContacts();renderActivation();renderDrills();renderExport();}
function download(name,content,type='application/json'){
  const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function bindActions(){
  $('#loadDemo').addEventListener('click',()=>{state=Core.normalizeState(Core.DEMO_STATE);bindValuesOnly();addReceipt('DEMO_LOADED',{synthetic:true});renderAll();saveState('已载入合成示例');});
  $('#saveLocal').addEventListener('click',()=>{addReceipt('LOCAL_SAVE',{view:currentView});saveState();renderDashboard();});
  $('#recompute').addEventListener('click',()=>{const s=Core.readinessSummary(state);addReceipt('READINESS_RECOMPUTED',{robustFloor:s.robustFloor,weakestWorld:s.weakestWorld.id});renderAll();saveState('已重新计算并写入回执');});
  $('#scanMessage').addEventListener('click',()=>{const r=Core.scanUrgentMessage($('#messageScanInput').value);const cls=r.level==='HIGH'?'bad':r.level==='ELEVATED'?'warn':'good';$('#messageScanResult').className=`result-box ${cls}`;$('#messageScanResult').innerHTML=`<b>风险信号：${esc(r.level)} · ${r.score}</b><p>${r.hits.length?r.hits.map(x=>esc(x.label)).join('；'):'未发现强模式'}</p><div class="compact-list">${r.actions.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`;addReceipt('MESSAGE_SCANNED',{level:r.level,score:r.score,contentStored:false});});
  $('#evaluateAi').addEventListener('click',()=>{const r=Core.evaluateAiAction({type:$('#aiActionType').value,external:$('#aiExternal').checked,irreversible:$('#aiIrreversible').checked,mandateValid:$('#aiMandate').checked,humanConfirmed:$('#aiHuman').checked});const cls=r.decision==='DENY'?'bad':r.decision.startsWith('HOLD')?'warn':'good';$('#aiResult').className=`result-box ${cls}`;$('#aiResult').innerHTML=`<b>${esc(r.decision)}</b><p>${r.reasons.map(esc).join(' ')}</p>`;addReceipt('AI_ACTION_EVALUATED',{type:r.action.type,decision:r.decision});});
  $('#addSource').addEventListener('click',()=>{const name=$('#sourceName').value.trim(),channel=$('#sourceChannel').value.trim();if(!name||!channel){toast('请填写来源名称和渠道');return;}state.trustedSources.push({name,channel,verifiedAt:$('#sourceDate').value||new Date().toISOString().slice(0,10)});state.preparedness.officialSources=Math.max(state.preparedness.officialSources,state.trustedSources.length);addReceipt('TRUSTED_SOURCE_ADDED',{name,channel,verifiedAt:$('#sourceDate').value||''});$('#sourceName').value='';$('#sourceChannel').value='';renderSources();toast('已添加来源');});
  $('#addContact').addEventListener('click',()=>{const name=$('#contactName').value.trim(),role=$('#contactRole').value.trim(),channels=$('#contactChannels').value.trim();if(!name||!role){toast('请填写联系人代号和角色');return;}state.contacts.push({name,role,channels});state.preparedness.mutualAidContacts=Math.max(state.preparedness.mutualAidContacts,state.contacts.length);addReceipt('MUTUAL_AID_CONTACT_ADDED',{name,role});$('#contactName').value='';$('#contactRole').value='';$('#contactChannels').value='';renderContacts();toast('已添加联系人');});
  $('#buildDrill').addEventListener('click',()=>{const d=Core.generateDrill(state,$('#drillType').value);$('#drillOutput').innerHTML=`<b>${esc(d.name)} · ${esc(d.duration)}</b><p>${esc(d.inject)}</p><ol>${d.success.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p class="note">停止条件：${esc(d.stop)}</p>`;});
  $('#saveDrill').addEventListener('click',()=>{const d={date:$('#drillDate').value||new Date().toISOString().slice(0,10),scenario:$('#drillScenario').value.trim(),result:$('#drillResult').value.trim(),revision:$('#drillRevision').value.trim()};if(!d.scenario||!d.result){toast('请填写演练情景和实际结果');return;}state.drills.push(d);state.preparedness.drillsCompleted=state.drills.length;addReceipt('DRILL_OUTCOME_RECORDED',{date:d.date,scenario:d.scenario,revision:d.revision});renderDrills();renderDashboard();saveState('演练结果已写入现实回执');});
  $('#downloadPackage').addEventListener('click',()=>{addReceipt('CONTINUITY_PACKAGE_EXPORTED',{format:'hcpkg.json'});download('shengzhou28-personal-continuity.hcpkg.json',JSON.stringify(Core.buildContinuityPackage(state),null,2));});
  $('#downloadBackup').addEventListener('click',()=>download('shengzhou28-full-local-backup.json',JSON.stringify(state,null,2)));
  $('#downloadPlan').addEventListener('click',()=>download('shengzhou28-action-plan.txt',Core.exportTextPlan(state),'text/plain'));
  $('#importBackup').addEventListener('click',()=>$('#importFile').click());
  $('#importFile').addEventListener('change',async()=>{const f=$('#importFile').files[0];if(!f)return;try{state=Core.normalizeState(JSON.parse(await f.text()));addReceipt('BACKUP_IMPORTED',{fileName:f.name});bindValuesOnly();renderAll();saveState('备份已导入');}catch(e){toast('导入失败：不是有效的JSON备份');}});
  $('#printCard').addEventListener('click',()=>{setView('export');setTimeout(()=>window.print(),150);});
  $('#verifyLedger').addEventListener('click',()=>{const r=Core.verifyReceipts(state.receipts);$('#ledgerStatus').className=`result-box ${r.valid?'good':'bad'}`;$('#ledgerStatus').innerHTML=r.valid?`<b>回执链有效</b><p>${r.count}条回执，链头 ${esc(r.head)}</p>`:`<b>回执链异常</b><p>${esc(r.reason)}</p>`;});
  $('#clearLocal').addEventListener('click',()=>{if(confirm('确认清除本浏览器中的生舟数据？请先导出备份。')){localStorage.removeItem(KEY);state=Core.normalizeState(Core.DEFAULT_STATE);bindValuesOnly();renderAll();toast('本地数据已清除');}});
}
function bindValuesOnly(){
  const specs=[['p_displayName','displayName'],['p_jurisdiction','jurisdiction'],['p_language','language'],['p_homeType','homeType'],['p_householdSize','householdSize','number'],['p_children','children','number'],['p_olderAdults','olderAdults','number'],['p_pets','pets','number'],['p_disabilityOrMedicalDependency','disabilityOrMedicalDependency','checkbox'],['p_transport','transport'],['p_essentialMonthlyCost','essentialMonthlyCost','number'],['p_localEmergencyNumber','localEmergencyNumber'],['p_nearestSafePlace','nearestSafePlace'],['p_outOfAreaContactName','outOfAreaContactName'],['p_outOfAreaContactPhone','outOfAreaContactPhone'],['p_meetingPointNear','meetingPointNear'],['p_meetingPointFar','meetingPointFar'],['p_verificationHint','verificationHint'],['p_notes','notes']];
  specs.forEach(([id,k,t='text'])=>{const el=$(`#${id}`);if(!el)return;if(t==='checkbox')el.checked=!!state.profile[k];else el.value=state.profile[k]??'';});
  $$('[data-prep]').forEach(el=>{const v=state.preparedness[el.dataset.prep];if(el.type==='checkbox')el.checked=!!v;else el.value=v??0;if(el.type==='range'){const out=el.closest('.range-row')?.querySelector('output');if(out)out.textContent=pct(v);}});
}
function init(){
  bindNavigation();bindProfile();bindPreparedness();bindActions();
  $('#drillDate').value=new Date().toISOString().slice(0,10);$('#sourceDate').value=new Date().toISOString().slice(0,10);
  renderAll();
  window.ShengzhouApp={getState:()=>Core.normalizeState(state),setState:x=>{state=Core.normalizeState(x);bindValuesOnly();renderAll();},setView,recompute:()=>Core.readinessSummary(state)};
}
document.addEventListener('DOMContentLoaded',init);
})();
