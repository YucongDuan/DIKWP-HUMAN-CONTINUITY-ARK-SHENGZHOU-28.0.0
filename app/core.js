(function(global){
'use strict';

const VERSION='28.0.0';
const MODE='SHENGZHOU28_AGI_DISCONTINUITY_LIFE_FLOOR_INFORMATION_INTEGRITY_DIGITAL_SOVEREIGNTY_COMMUNITY_RECOVERY_REALITY_CLOSURE';

const DOMAINS=[
  {id:'supplies',name:'Water, food and essential supplies',short:'Supplies'},
  {id:'health',name:'Health, medication and dependent care',short:'Health'},
  {id:'shelter',name:'Shelter, power and utilities',short:'Shelter'},
  {id:'communication',name:'Family communication and trust verification',short:'Communication'},
  {id:'identity',name:'Identity, documents and account recovery',short:'Identity'},
  {id:'finance',name:'Money, payments and income continuity',short:'Finance'},
  {id:'digital',name:'Digital security and offline data continuity',short:'Digital'},
  {id:'information',name:'Information integrity and official-source access',short:'Information'},
  {id:'ai_authority',name:'AI and agent authority firewall',short:'AI authority'},
  {id:'mobility',name:'Mobility, meeting points and relocation',short:'Mobility'},
  {id:'community',name:'Community mutual aid and local support',short:'Community'},
  {id:'psychological',name:'Psychological continuity and family routines',short:'Psychological'}
];

const WORLDS=[
  {
    id:'rapid_automation',name:'Rapid automation and income shock',weight:0.16,
    description:'Work and income change faster than institutions and household plans can adapt.',
    impact:{supplies:.92,health:.90,shelter:.92,communication:.96,identity:.96,finance:.48,digital:.90,information:.82,ai_authority:.78,mobility:.90,community:.82,psychological:.62}
  },
  {
    id:'ai_fraud',name:'AI-enabled fraud, impersonation and influence',weight:0.14,
    description:'Voice, video, text and authority impersonation create urgent false decisions.',
    impact:{supplies:.96,health:.86,shelter:.96,communication:.52,identity:.52,finance:.48,digital:.62,information:.42,ai_authority:.50,mobility:.88,community:.72,psychological:.70}
  },
  {
    id:'cyber_identity',name:'Cyber compromise and identity lockout',weight:0.14,
    description:'Accounts, devices, cloud files or identity credentials become untrusted or inaccessible.',
    impact:{supplies:.92,health:.82,shelter:.90,communication:.58,identity:.40,finance:.50,digital:.38,information:.66,ai_authority:.54,mobility:.84,community:.78,psychological:.72}
  },
  {
    id:'cloud_payment_outage',name:'Cloud, payment and communications outage',weight:0.13,
    description:'Normal banking, messaging, navigation or cloud services are unavailable for days.',
    impact:{supplies:.72,health:.72,shelter:.78,communication:.44,identity:.62,finance:.38,digital:.46,information:.58,ai_authority:.72,mobility:.66,community:.72,psychological:.78}
  },
  {
    id:'essential_services',name:'Essential-service and supply disruption',weight:0.13,
    description:'Power, medicine, food, water, transport or public services become unreliable.',
    impact:{supplies:.40,health:.44,shelter:.48,communication:.72,identity:.86,finance:.70,digital:.64,information:.66,ai_authority:.84,mobility:.60,community:.58,psychological:.68}
  },
  {
    id:'autonomous_agent_incident',name:'Autonomous-agent or system-control incident',weight:0.12,
    description:'An AI-enabled workflow acts outside its intended purpose or causes cascading failures.',
    impact:{supplies:.86,health:.72,shelter:.80,communication:.62,identity:.54,finance:.52,digital:.42,information:.50,ai_authority:.34,mobility:.76,community:.72,psychological:.66}
  },
  {
    id:'local_relocation',name:'Local safety failure and temporary relocation',weight:0.10,
    description:'The household must shelter elsewhere or move without full digital or service access.',
    impact:{supplies:.56,health:.58,shelter:.36,communication:.54,identity:.60,finance:.64,digital:.62,information:.68,ai_authority:.84,mobility:.34,community:.52,psychological:.56}
  },
  {
    id:'compound_crisis',name:'Compound discontinuity',weight:0.08,
    description:'Income, information, payment, communications and essential services fail together.',
    impact:{supplies:.38,health:.40,shelter:.42,communication:.36,identity:.40,finance:.32,digital:.30,information:.34,ai_authority:.32,mobility:.38,community:.42,psychological:.38}
  }
];

const SIGNALS=[
  {id:'official_alert',label:'A verified official emergency or evacuation alert',points:4},
  {id:'immediate_life_threat',label:'Immediate threat to life, health or physical safety',points:5},
  {id:'power_outage',label:'Power or utilities unavailable for more than 8 hours',points:2},
  {id:'communication_outage',label:'Primary communications unavailable for more than 4 hours',points:2},
  {id:'payment_failures',label:'Multiple independent payment rails failing',points:2},
  {id:'identity_takeover',label:'Account takeover, identity fraud or unauthorized transactions',points:4},
  {id:'deepfake_request',label:'Urgent money or secrecy request using voice/video impersonation',points:3},
  {id:'medicine_shortage',label:'Essential medicine or care supply unavailable',points:3},
  {id:'agent_overreach',label:'AI or automated system acting beyond granted authority',points:4},
  {id:'income_loss',label:'Household income suddenly falls by more than half',points:2},
  {id:'conflicting_sources',label:'High-impact claims conflict across trusted sources',points:1},
  {id:'local_disorder',label:'Local transport, public order or essential services visibly degrading',points:3}
];

const ACTION_LIBRARY=[
  {id:'water3',domain:'supplies',title:'Create a three-day water baseline',effort:'low',priority:5,condition:s=>num(s.preparedness.waterDays)<3,steps:['Estimate household and pet needs using local emergency guidance.','Store clean water in food-safe containers.','Label and rotate it.']},
  {id:'food14',domain:'supplies',title:'Build a rotating two-week food reserve',effort:'medium',priority:4,condition:s=>num(s.preparedness.foodDays)<14,steps:['Choose food your household already eats.','Include manual preparation options.','Track allergies, infant and pet needs.']},
  {id:'med14',domain:'health',title:'Create medication continuity',effort:'medium',priority:5,condition:s=>num(s.preparedness.medicationDays)<14,steps:['Ask the prescriber or pharmacist what reserve is lawful and clinically appropriate.','Keep a current medication and allergy summary.','Record refill and alternative-pharmacy routes.']},
  {id:'medicalcard',domain:'health',title:'Prepare a paper health summary',effort:'low',priority:4,condition:s=>!s.preparedness.medicalSummary,steps:['List diagnoses, allergies, medications, doses and emergency contacts.','Avoid unnecessary sensitive history.','Keep a paper copy in the go-bag.']},
  {id:'power',domain:'shelter',title:'Provide safe backup power and lighting',effort:'medium',priority:4,condition:s=>num(s.preparedness.powerBackupHours)<12,steps:['Prioritize medical devices, phones, lights and radios.','Use only manufacturer-approved charging and ventilation practices.','Test monthly.']},
  {id:'familyplan',domain:'communication',title:'Create a two-channel family communication plan',effort:'low',priority:5,condition:s=>!s.preparedness.twoChannelVerification||num(s.preparedness.trustedContacts)<3,steps:['Choose an out-of-area contact.','Define two meeting points.','Require callback to a known number plus a private challenge for urgent requests.']},
  {id:'papercontacts',domain:'communication',title:'Print critical contacts',effort:'low',priority:4,condition:s=>!s.preparedness.paperContacts,steps:['Include household, medical, school, workplace, utility and insurance numbers.','Do not rely solely on a cloud contact list.','Update every quarter.']},
  {id:'documents',domain:'identity',title:'Make protected identity and entitlement copies',effort:'medium',priority:5,condition:s=>!s.preparedness.documentCopies,steps:['Copy essential identity, insurance, prescription and property documents.','Keep one encrypted backup and one protected paper copy.','Record official recovery contacts.']},
  {id:'recoverycodes',domain:'identity',title:'Store account recovery paths offline',effort:'low',priority:4,condition:s=>!s.preparedness.recoveryCodes,steps:['Generate recovery codes for critical accounts.','Store them away from the primary device.','Never place secrets in this client.']},
  {id:'cashrail',domain:'finance',title:'Reduce dependence on one payment rail',effort:'medium',priority:5,condition:s=>num(s.preparedness.paymentRails)<2||num(s.preparedness.cashDays)<3,steps:['Maintain lawful access to at least two independent payment methods.','Keep a modest emergency cash reserve where appropriate.','List billers and recovery phone numbers on paper.']},
  {id:'runway',domain:'finance',title:'Build a 30-day essential-expense runway',effort:'high',priority:5,condition:s=>num(s.preparedness.reserveDays)<30,steps:['Calculate essential, not aspirational, monthly costs.','Automate a small regular reserve if feasible.','Prioritize liquidity and access over speculative return.']},
  {id:'income',domain:'finance',title:'Create a second income or mutual-support route',effort:'high',priority:4,condition:s=>num(s.preparedness.incomeSources)<2,steps:['Identify one bounded service or skill that can earn locally or remotely.','Create one verifiable work sample.','Avoid debt-funded emergency schemes.']},
  {id:'mfa',domain:'digital',title:'Protect critical accounts with strong MFA',effort:'low',priority:5,condition:s=>num(s.preparedness.mfaCoverage)<.8,steps:['Prioritize email, banking, mobile carrier, cloud storage and identity accounts.','Prefer phishing-resistant methods where available.','Review recovery methods.']},
  {id:'passwords',domain:'digital',title:'Use unique passwords and a password manager',effort:'low',priority:5,condition:s=>!s.preparedness.passwordManager,steps:['Replace reused passwords on critical accounts.','Secure the manager with strong MFA.','Keep an offline recovery plan.']},
  {id:'offlinebackup',domain:'digital',title:'Maintain tested offline backups',effort:'medium',priority:5,condition:s=>num(s.preparedness.offlineBackups)<1,steps:['Back up identity, contacts, health summary, work evidence and key files.','Disconnect the backup when not in use.','Test restore, not just backup creation.']},
  {id:'sources',domain:'information',title:'Build a trusted-source board',effort:'low',priority:5,condition:s=>num(s.preparedness.officialSources)<3,steps:['List local emergency, health, weather, utility and government sources.','Record an offline phone or radio alternative.','Date every source check.']},
  {id:'verification',domain:'information',title:'Adopt a pause–verify–triangulate protocol',effort:'low',priority:5,condition:s=>!s.preparedness.twoSourceRule,steps:['Pause before forwarding or paying.','Separate direct observation, source statements and inference.','For high-impact claims, verify through two independent channels.']},
  {id:'agentinventory',domain:'ai_authority',title:'Inventory every AI or automation with account access',effort:'medium',priority:5,condition:s=>!s.preparedness.agentInventory,steps:['List apps, browser extensions, OAuth grants and delegated agents.','Record what each can read, write, send or purchase.','Remove unused access.']},
  {id:'agentfirewall',domain:'ai_authority',title:'Enforce human confirmation for irreversible actions',effort:'low',priority:5,condition:s=>!s.preparedness.humanConfirmCritical||!s.preparedness.noAutoTransfer,steps:['Require named human confirmation for money, contracts, identity, health, legal, home-access and deletion actions.','Use transaction-specific limits and expiry.','Maintain a revocation procedure.']},
  {id:'gobag',domain:'mobility',title:'Assemble a lightweight go-bag',effort:'medium',priority:4,condition:s=>!s.preparedness.goBag,steps:['Include copies, medications, water, food, charger, light, clothing and hygiene items.','Tailor for children, elders, disability and pets.','Keep weight manageable.']},
  {id:'routes',domain:'mobility',title:'Define two routes and two meeting points',effort:'low',priority:4,condition:s=>num(s.preparedness.routes)<2||num(s.preparedness.meetingPoints)<2,steps:['Choose one nearby and one out-of-area meeting point.','Plan one route that does not depend on live navigation.','Rehearse with household members.']},
  {id:'community',domain:'community',title:'Build a three-person local mutual-aid cell',effort:'medium',priority:5,condition:s=>num(s.preparedness.mutualAidContacts)<3,steps:['Include people with different skills and resources.','Agree how to check on vulnerable members.','Exchange only the minimum contact and need information.']},
  {id:'mental',domain:'psychological',title:'Write a psychological continuity routine',effort:'low',priority:4,condition:s=>!s.preparedness.calmProtocol||num(s.preparedness.checkInPeople)<2,steps:['Define sleep, meals, movement and media limits.','Choose two people for regular check-ins.','Record local professional and crisis support routes.']},
  {id:'drill',domain:'community',title:'Run one 30-minute continuity drill',effort:'medium',priority:4,condition:s=>num(s.preparedness.drillsCompleted)<1,steps:['Simulate loss of one service.','Do not create real danger or contact emergency services.','Record what failed and revise the plan.']}
];

function num(v){const n=Number(v);return Number.isFinite(n)?n:0;}
function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,num(v)));}
function ratio(v,target){return clamp(num(v)/target);}
function bool(v){return v?1:0;}
function avg(arr){return arr.length?arr.reduce((a,b)=>a+num(b),0)/arr.length:0;}
function min(arr){return arr.length?Math.min(...arr):0;}
function deepClone(v){return JSON.parse(JSON.stringify(v));}
function isoNow(){return new Date().toISOString();}
function stableStringify(value){
  if(value===null||typeof value!=='object') return JSON.stringify(value);
  if(Array.isArray(value)) return '['+value.map(stableStringify).join(',')+']';
  return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stableStringify(value[k])).join(',')+'}';
}
function simpleHash(str){
  let h1=0xdeadbeef^str.length,h2=0x41c6ce57^str.length;
  for(let i=0,ch;i<str.length;i++){ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677);}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);
  h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);
  return (4294967296*(2097151&h2)+(h1>>>0)).toString(16).padStart(14,'0');
}

const DEFAULT_PREPAREDNESS={
  waterDays:1,foodDays:3,medicationDays:5,hygieneDays:3,kitCompletion:.25,
  medicalSummary:false,firstAid:false,prescriptionCopies:false,careBackup:false,professionalSupportContact:false,
  powerBackupHours:2,shelterPlan:false,smokeAlarm:true,utilityShutoffKnowledge:false,alternativeTemperaturePlan:false,
  trustedContacts:1,outOfAreaContact:false,meetingPoints:0,offlineRadio:false,paperContacts:false,twoChannelVerification:false,
  documentCopies:false,recoveryCodes:false,cleanDevicePlan:false,officialAccountContacts:false,secureStorage:false,
  cashDays:1,reserveDays:5,paymentRails:1,incomeSources:1,billList:false,fraudFreezePlan:false,
  mfaCoverage:.35,passwordManager:false,offlineBackups:0,softwareUpdates:true,accountRecovery:false,oauthReview:false,
  officialSources:1,twoSourceRule:false,pauseBeforeShare:true,rumorLog:false,offlineSourceList:false,sourceDiversity:false,
  humanConfirmCritical:false,noAutoTransfer:false,noAutoContract:false,revocationPlan:false,agentInventory:false,leastPrivilege:false,
  goBag:false,routes:0,transportBackup:false,destinationPlan:false,petPlan:false,
  mutualAidContacts:1,vulnerableCheck:false,skillOffer:false,sharedResources:false,localOrganizations:false,
  transferableSkills:1,workEvidence:0,ninetyDayIncomePlan:false,localServiceSkill:false,
  checkInPeople:1,sleepPlan:false,calmProtocol:false,mediaLimit:false,dependentRoutine:false,
  drillsCompleted:0
};

const DEFAULT_STATE={
  meta:{version:VERSION,mode:MODE,createdAt:'',updatedAt:''},
  profile:{
    displayName:'My household',jurisdiction:'',language:'',householdSize:1,children:0,olderAdults:0,
    disabilityOrMedicalDependency:false,pets:0,homeType:'',transport:'',essentialMonthlyCost:0,
    notes:'',localEmergencyNumber:'',nearestSafePlace:'',outOfAreaContactName:'',outOfAreaContactPhone:'',
    meetingPointNear:'',meetingPointFar:'',verificationHint:'Do not store the actual family codeword here.'
  },
  preparedness:deepClone(DEFAULT_PREPAREDNESS),
  worlds:WORLDS.map(w=>({id:w.id,weight:w.weight,severity:1})),
  signals:[],
  aiActions:[],
  trustedSources:[],
  contacts:[],
  kitNotes:[],
  drills:[],
  receipts:[]
};

const DEMO_STATE=deepClone(DEFAULT_STATE);
Object.assign(DEMO_STATE.profile,{
  displayName:'Lin Household — synthetic example',jurisdiction:'Local jurisdiction (verify official sources)',language:'Chinese / English',
  householdSize:3,children:1,olderAdults:0,disabilityOrMedicalDependency:false,pets:1,homeType:'Apartment',transport:'Public transit + bicycle',
  essentialMonthlyCost:6200,localEmergencyNumber:'Verify locally',nearestSafePlace:'Community public building (verify access)',
  outOfAreaContactName:'Synthetic Contact A',outOfAreaContactPhone:'Stored on paper, not in demo',meetingPointNear:'Building entrance if safe',
  meetingPointFar:'Designated community point',verificationHint:'Private family challenge stored offline.'
});
Object.assign(DEMO_STATE.preparedness,{
  waterDays:3,foodDays:12,medicationDays:14,hygieneDays:7,kitCompletion:.74,
  medicalSummary:true,firstAid:true,prescriptionCopies:true,careBackup:true,professionalSupportContact:true,
  powerBackupHours:18,shelterPlan:true,smokeAlarm:true,utilityShutoffKnowledge:true,alternativeTemperaturePlan:true,
  trustedContacts:4,outOfAreaContact:true,meetingPoints:2,offlineRadio:true,paperContacts:true,twoChannelVerification:true,
  documentCopies:true,recoveryCodes:true,cleanDevicePlan:true,officialAccountContacts:true,secureStorage:true,
  cashDays:5,reserveDays:45,paymentRails:3,incomeSources:2,billList:true,fraudFreezePlan:true,
  mfaCoverage:.92,passwordManager:true,offlineBackups:2,softwareUpdates:true,accountRecovery:true,oauthReview:true,
  officialSources:5,twoSourceRule:true,pauseBeforeShare:true,rumorLog:true,offlineSourceList:true,sourceDiversity:true,
  humanConfirmCritical:true,noAutoTransfer:true,noAutoContract:true,revocationPlan:true,agentInventory:true,leastPrivilege:true,
  goBag:true,routes:2,transportBackup:true,destinationPlan:true,petPlan:true,
  mutualAidContacts:4,vulnerableCheck:true,skillOffer:true,sharedResources:true,localOrganizations:true,
  transferableSkills:4,workEvidence:3,ninetyDayIncomePlan:true,localServiceSkill:true,
  checkInPeople:3,sleepPlan:true,calmProtocol:true,mediaLimit:true,dependentRoutine:true,drillsCompleted:2
});
DEMO_STATE.trustedSources=[
  {name:'Local emergency management authority',channel:'official site / alert / phone',verifiedAt:'2026-09-06'},
  {name:'Local health authority or clinic',channel:'official site / phone',verifiedAt:'2026-09-06'},
  {name:'Utility provider outage channel',channel:'official site / SMS / phone',verifiedAt:'2026-09-06'}
];
DEMO_STATE.contacts=[
  {name:'Synthetic Contact A',role:'out-of-area relay',channels:'phone + paper copy'},
  {name:'Synthetic Contact B',role:'nearby mutual aid',channels:'phone + in-person'},
  {name:'Synthetic Contact C',role:'childcare backup',channels:'phone + known address'}
];
DEMO_STATE.drills=[{date:'2026-08-30',scenario:'Four-hour communications outage',result:'Paper contact list worked; power bank needed recharge.',revision:'Added monthly charging reminder.'}];

function normalizeState(input){
  const s=deepClone(DEFAULT_STATE);
  if(input&&typeof input==='object'){
    s.meta=Object.assign(s.meta,input.meta||{});
    s.profile=Object.assign(s.profile,input.profile||{});
    s.preparedness=Object.assign(s.preparedness,input.preparedness||{});
    if(Array.isArray(input.worlds)) s.worlds=input.worlds.map(w=>Object.assign({weight:0,severity:1},w));
    ['signals','aiActions','trustedSources','contacts','kitNotes','drills','receipts'].forEach(k=>{if(Array.isArray(input[k]))s[k]=input[k];});
  }
  s.meta.version=VERSION;s.meta.mode=MODE;s.meta.updatedAt=isoNow();if(!s.meta.createdAt)s.meta.createdAt=s.meta.updatedAt;
  return s;
}

function domainScores(state){
  const p=normalizeState(state).preparedness;
  const scores={
    supplies:avg([ratio(p.waterDays,3),ratio(p.foodDays,14),ratio(p.hygieneDays,7),clamp(p.kitCompletion)]),
    health:avg([ratio(p.medicationDays,14),bool(p.medicalSummary),bool(p.firstAid),bool(p.prescriptionCopies),bool(p.careBackup),bool(p.professionalSupportContact)]),
    shelter:avg([ratio(p.powerBackupHours,24),bool(p.shelterPlan),bool(p.smokeAlarm),bool(p.utilityShutoffKnowledge),bool(p.alternativeTemperaturePlan)]),
    communication:avg([ratio(p.trustedContacts,3),bool(p.outOfAreaContact),ratio(p.meetingPoints,2),bool(p.offlineRadio),bool(p.paperContacts),bool(p.twoChannelVerification)]),
    identity:avg([bool(p.documentCopies),bool(p.recoveryCodes),bool(p.cleanDevicePlan),bool(p.officialAccountContacts),bool(p.secureStorage)]),
    finance:avg([ratio(p.cashDays,7),ratio(p.reserveDays,30),ratio(p.paymentRails,2),ratio(p.incomeSources,2),bool(p.billList),bool(p.fraudFreezePlan),ratio(p.transferableSkills,3),ratio(p.workEvidence,2),bool(p.ninetyDayIncomePlan),bool(p.localServiceSkill)]),
    digital:avg([clamp(p.mfaCoverage),bool(p.passwordManager),ratio(p.offlineBackups,2),bool(p.softwareUpdates),bool(p.accountRecovery),bool(p.oauthReview)]),
    information:avg([ratio(p.officialSources,3),bool(p.twoSourceRule),bool(p.pauseBeforeShare),bool(p.rumorLog),bool(p.offlineSourceList),bool(p.sourceDiversity)]),
    ai_authority:avg([bool(p.humanConfirmCritical),bool(p.noAutoTransfer),bool(p.noAutoContract),bool(p.revocationPlan),bool(p.agentInventory),bool(p.leastPrivilege)]),
    mobility:avg([bool(p.goBag),ratio(p.routes,2),bool(p.transportBackup),ratio(p.meetingPoints,2),bool(p.destinationPlan),bool(p.petPlan||num(state.profile&&state.profile.pets)===0)]),
    community:avg([ratio(p.mutualAidContacts,3),bool(p.vulnerableCheck),bool(p.skillOffer),bool(p.sharedResources),bool(p.localOrganizations)]),
    psychological:avg([ratio(p.checkInPeople,2),bool(p.sleepPlan),bool(p.calmProtocol),bool(p.mediaLimit),bool(p.dependentRoutine||num(state.profile&&state.profile.children)===0)])
  };
  Object.keys(scores).forEach(k=>scores[k]=clamp(scores[k]));
  return scores;
}

function worldResults(state){
  const s=normalizeState(state),base=domainScores(s);
  const out=[];
  WORLDS.forEach(world=>{
    const override=s.worlds.find(w=>w.id===world.id)||{weight:world.weight,severity:1};
    const severity=clamp(override.severity ?? 1,0,1);
    const adjusted={};
    DOMAINS.forEach(d=>{
      const impact=world.impact[d.id]===undefined?1:world.impact[d.id];
      const effectiveImpact=1-severity*(1-impact);
      adjusted[d.id]=clamp(base[d.id]*effectiveImpact);
    });
    out.push({id:world.id,name:world.name,description:world.description,weight:clamp(override.weight),severity,
      scores:adjusted,floor:min(Object.values(adjusted)),weakest:Object.entries(adjusted).sort((a,b)=>a[1]-b[1]).slice(0,3).map(([id,score])=>({id,score}))});
  });
  return out;
}

function readinessSummary(state){
  const base=domainScores(state),worlds=worldResults(state);
  const robustFloor=min(worlds.map(w=>w.floor));
  const weightedFloor=worlds.reduce((a,w)=>a+w.weight*w.floor,0)/(worlds.reduce((a,w)=>a+w.weight,0)||1);
  const weakestBase=Object.entries(base).sort((a,b)=>a[1]-b[1]).map(([id,score])=>({id,score}));
  const weakestWorld=worlds.slice().sort((a,b)=>a.floor-b.floor)[0];
  return {base,worlds,robustFloor,weightedFloor,weakestBase,weakestWorld};
}

function triggerMode(selectedSignals){
  const ids=Array.isArray(selectedSignals)?selectedSignals:[];
  const chosen=SIGNALS.filter(s=>ids.includes(s.id));
  const total=chosen.reduce((a,s)=>a+s.points,0);
  const max=chosen.reduce((a,s)=>Math.max(a,s.points),0);
  let level=0;
  if(max>=5||total>=10)level=4;
  else if(max>=4||total>=7)level=3;
  else if(max>=3||total>=4)level=2;
  else if(total>0)level=1;
  const modes=[
    {level:0,name:'Baseline readiness',instruction:'Continue preparation, source verification and regular drills.'},
    {level:1,name:'Verify and prepare',instruction:'Pause irreversible actions, verify through independent channels, charge devices and review the contact plan.'},
    {level:2,name:'Continuity mode',instruction:'Protect people and essential supplies, move to offline communications, preserve evidence and activate backup payment and care routes.'},
    {level:3,name:'Protective isolation',instruction:'Stop delegated AI and compromised accounts, separate clean devices, use trusted contacts, and follow verified local official instructions.'},
    {level:4,name:'Life-safety and relocation mode',instruction:'Prioritize immediate physical safety, emergency services and verified evacuation or shelter instructions. Take the go-bag and account for household members.'}
  ];
  return Object.assign({signals:chosen,total},modes[level]);
}

function getPriorityActions(state,limit=12){
  const s=normalizeState(state),summary=readinessSummary(s);
  const worldPressure={};
  DOMAINS.forEach(d=>{worldPressure[d.id]=Math.min(...summary.worlds.map(w=>w.scores[d.id]));});
  return ACTION_LIBRARY.filter(a=>a.condition(s)).map(a=>{
    const gap=1-(worldPressure[a.domain]||0);
    return Object.assign({},a,{urgency:a.priority*gap,domainName:(DOMAINS.find(d=>d.id===a.domain)||{}).name||a.domain});
  }).sort((a,b)=>b.urgency-a.urgency||b.priority-a.priority).slice(0,limit);
}

function emergencyActions(level){
  const common=['Stop nonessential automated actions and do not make irreversible decisions based on one message.','Check every household member and urgent medical dependency.','Use official local alerts and a second independent channel before acting on extraordinary claims.'];
  const map={
    0:['Review one weakest domain and schedule a drill.'],
    1:['Charge phones and power banks.','Print or open the offline contact card.','Check medicine, water, transport and payment access.'],
    2:['Activate the household contact tree.','Move essential instructions and documents to offline access.','Preserve screenshots, timestamps and transaction evidence.','Use backup payment and communication routes.'],
    3:['Revoke or suspend AI agents, OAuth grants and sessions from a clean device.','Isolate compromised devices rather than experimenting on them.','Call financial and identity providers using known official numbers.','Tell trusted contacts not to act on voice or video alone.'],
    4:['Follow verified evacuation or shelter instructions.','Take medications, documents, communication tools, water and the go-bag.','Notify the out-of-area relay when safe.','Do not enter unsafe areas to recover replaceable property.']
  };
  return common.concat(map[clamp(level,0,4)]||map[0]);
}

function buildKitList(state){
  const s=normalizeState(state),n=Math.max(1,num(s.profile.householdSize));
  return [
    {category:'Water and food',item:`Water for at least three days for ${n} household member(s), adjusted for climate, health and pets`,done:num(s.preparedness.waterDays)>=3},
    {category:'Water and food',item:'Rotating food reserve and a manual preparation method',done:num(s.preparedness.foodDays)>=7},
    {category:'Health',item:'Essential medicines and current medication/allergy summary',done:num(s.preparedness.medicationDays)>=7&&s.preparedness.medicalSummary},
    {category:'Health',item:'First-aid materials and dependent-care supplies',done:s.preparedness.firstAid&&s.preparedness.careBackup},
    {category:'Power',item:'Flashlight, safe charging, batteries or approved backup power',done:num(s.preparedness.powerBackupHours)>=8},
    {category:'Communication',item:'Paper contact list, radio/offline alert route and household plan',done:s.preparedness.paperContacts&&s.preparedness.offlineRadio},
    {category:'Identity',item:'Protected copies of identity, insurance, prescriptions and critical account contacts',done:s.preparedness.documentCopies&&s.preparedness.officialAccountContacts},
    {category:'Money',item:'Lawful access to more than one payment method and modest emergency cash where appropriate',done:num(s.preparedness.paymentRails)>=2&&num(s.preparedness.cashDays)>=2},
    {category:'Mobility',item:'Manageable go-bag, routes, meeting points and transport backup',done:s.preparedness.goBag&&num(s.preparedness.routes)>=2},
    {category:'Household',item:'Sanitation, clothing, weather protection, children/elder/disability/pet needs',done:clamp(s.preparedness.kitCompletion)>=.75}
  ];
}

function scanUrgentMessage(text){
  const t=String(text||'').toLowerCase();
  const rules=[
    {id:'urgency',label:'Urgency pressure',re:/(immediately|right now|urgent|emergency|马上|立即|紧急|现在就)/i,score:2},
    {id:'secrecy',label:'Secrecy request',re:/(do not tell|keep this secret|保密|不要告诉|别联系)/i,score:3},
    {id:'payment',label:'Irreversible or unusual payment',re:/(gift card|cryptocurrency|crypto|wire transfer|转账|礼品卡|虚拟币|验证码|助记词|私钥)/i,score:4},
    {id:'authority',label:'Authority impersonation',re:/(police|doctor|lawyer|government|bank security|公安|医生|律师|政府|银行客服)/i,score:2},
    {id:'account',label:'Credential or account request',re:/(password|verification code|one-time code|otp|密码|验证码|登录码)/i,score:5},
    {id:'link',label:'Unknown link or remote-control request',re:/(click this link|install this app|screen share|remote control|点击链接|安装.*软件|共享屏幕|远程控制)/i,score:4},
    {id:'family',label:'Family emergency claim',re:/(your son|your daughter|your child|your parent|family member|你儿子|你女儿|孩子出事|家人出事)/i,score:2}
  ];
  const hits=rules.filter(r=>r.re.test(t));
  const score=hits.reduce((a,h)=>a+h.score,0);
  const level=score>=8?'HIGH':score>=4?'ELEVATED':score>0?'CHECK':'LOW';
  const actions=level==='LOW'?
    ['No strong scam pattern detected. Still verify high-impact claims independently.']:
    ['Do not pay, disclose codes or install software.','End the contact and call the person or institution using a number you already know.','Ask a trusted second person to verify.','Preserve the message and report through the relevant official channel.'];
  return {level,score,hits,actions};
}

function evaluateAiAction(action){
  const a=Object.assign({type:'local_analysis',external:false,irreversible:false,humanConfirmed:false,mandateValid:false},action||{});
  const forbidden=['autonomous_medical_diagnosis','autonomous_legal_decision','human_worth_ranking','weapon_control','disable_human_stop'];
  const critical=['transfer_money','sign_contract','change_identity','send_sensitive_message','grant_access','delete_data','change_medication','unlock_home','submit_government_form'];
  let decision='ALLOW_LOCAL_REVERSIBLE_ANALYSIS',reasons=[];
  if(forbidden.includes(a.type)){decision='DENY';reasons.push('Action class cannot be delegated to this reference system.');}
  else if(critical.includes(a.type)||a.external||a.irreversible){
    decision=(a.humanConfirmed&&a.mandateValid)?'HOLD_FOR_FINAL_NAMED_HUMAN_CONFIRMATION':'HOLD_FOR_HUMAN';
    reasons.push('External or irreversible action requires transaction-specific human authority.');
  } else reasons.push('Local, reversible analysis may proceed.');
  return {decision,reasons,action:a};
}

function createReceipt(state,eventType,payload){
  const s=normalizeState(state),prev=s.receipts.length?s.receipts[s.receipts.length-1].hash:'GENESIS';
  const body={id:`rcpt-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,version:VERSION,time:isoNow(),eventType,payload:payload||{},previousHash:prev};
  body.hash=simpleHash(stableStringify(body));s.receipts.push(body);return {state:s,receipt:body};
}
function verifyReceipts(receipts){
  let prev='GENESIS';
  for(const r of (receipts||[])){
    if(r.previousHash!==prev)return {valid:false,reason:`Previous hash mismatch at ${r.id}`};
    const copy=Object.assign({},r);delete copy.hash;
    if(simpleHash(stableStringify(copy))!==r.hash)return {valid:false,reason:`Hash mismatch at ${r.id}`};
    prev=r.hash;
  }
  return {valid:true,count:(receipts||[]).length,head:prev};
}

function buildEmergencyCard(state){
  const s=normalizeState(state),m=triggerMode(s.signals);
  return {
    title:'SHENGZHOU 28.0 — OFFLINE HOUSEHOLD CONTINUITY CARD',
    household:s.profile.displayName,
    householdSize:s.profile.householdSize,
    dependents:{children:s.profile.children,olderAdults:s.profile.olderAdults,medicalDependency:s.profile.disabilityOrMedicalDependency,pets:s.profile.pets},
    emergencyNumber:s.profile.localEmergencyNumber||'Verify and write the local emergency number',
    nearestSafePlace:s.profile.nearestSafePlace||'Not set',
    meetingPoints:[s.profile.meetingPointNear||'Near point not set',s.profile.meetingPointFar||'Far point not set'],
    outOfAreaRelay:{name:s.profile.outOfAreaContactName||'Not set',phone:s.profile.outOfAreaContactPhone||'Keep on paper'},
    verification:'Do not trust voice or video alone. End the contact, call a known number, and use a private challenge plus a second person.',
    currentMode:m.name,
    immediateActions:emergencyActions(m.level).slice(0,8),
    warning:'Follow verified local official instructions in an actual emergency. This card is not an emergency service.'
  };
}

function generateDrill(state,type){
  const s=normalizeState(state);
  const drills={
    communication:{name:'Communications outage drill',duration:'30 minutes',inject:'Assume messaging and cloud contacts are unavailable.',success:['Find paper contacts','Reach the out-of-area relay using an alternate channel or simulate it','Meet at the stated point','Record one failure'],stop:'Stop immediately if the drill could confuse a real emergency service or vulnerable household member.'},
    payment:{name:'Payment outage drill',duration:'30 minutes',inject:'Assume the primary bank or mobile wallet is unavailable.',success:['Identify essential expenses','Use or simulate a second lawful rail','Find official support numbers','Avoid revealing credentials'],stop:'Do not make unnecessary real purchases or transfers.'},
    identity:{name:'Identity compromise drill',duration:'45 minutes',inject:'Assume email and one major account are compromised.',success:['Locate recovery codes','Identify the clean device','Find official freeze/recovery channels','Preserve a synthetic evidence timeline'],stop:'Use synthetic data only; do not intentionally lock real accounts.'},
    relocation:{name:'Go-bag and route drill',duration:'45 minutes',inject:'Assume the home is temporarily unavailable.',success:['Account for every household member','Take the go-bag','Reach a safe meeting point or simulate route','Check pet and medication needs'],stop:'Do not enter unsafe areas or violate local rules.'},
    misinformation:{name:'Deepfake and rumor drill',duration:'20 minutes',inject:'Use a synthetic urgent message that asks for secrecy or money.',success:['Pause','Call back using a known number','Use a second verifier','Record the evidence classification'],stop:'Do not use a real person’s voice or create deceptive media.'}
  };
  return drills[type]||drills.communication;
}

function buildContinuityPackage(state){
  const s=normalizeState(state),summary=readinessSummary(s),mode=triggerMode(s.signals);
  return {
    schema:'https://example.org/dikwp/shengzhou/28/personal-continuity-package',
    version:VERSION,mode:MODE,generatedAt:isoNow(),
    profile:s.profile,preparedness:s.preparedness,worlds:s.worlds,
    readiness:{base:summary.base,robustFloor:summary.robustFloor,weightedFloor:summary.weightedFloor,weakestWorld:{id:summary.weakestWorld.id,floor:summary.weakestWorld.floor}},
    activation:mode,
    priorityActions:getPriorityActions(s,20),
    emergencyCard:buildEmergencyCard(s),
    trustedSources:s.trustedSources,contacts:s.contacts,drills:s.drills,receipts:s.receipts,
    boundaries:{notEmergencyService:true,notMedicalAdvice:true,notFinancialAdvice:true,noSecrets:true,noExternalAutomaticAction:true,noHumanWorthRanking:true}
  };
}

function exportTextPlan(state){
  const s=normalizeState(state),summary=readinessSummary(s),mode=triggerMode(s.signals),actions=getPriorityActions(s,12),card=buildEmergencyCard(s);
  const lines=[];
  lines.push('DIKWP HUMAN CONTINUITY ARK / SHENGZHOU 28.0.0');
  lines.push(`Household: ${s.profile.displayName}`);
  lines.push(`Current activation mode: ${mode.name}`);
  lines.push(`Robust continuity floor (planning signal): ${(summary.robustFloor*100).toFixed(1)}%`);
  lines.push(`Weakest disruption world: ${summary.weakestWorld.name}`);
  lines.push('');lines.push('IMMEDIATE ACTIONS');mode.instruction&&lines.push(`- ${mode.instruction}`);emergencyActions(mode.level).forEach(x=>lines.push(`- ${x}`));
  lines.push('');lines.push('PRIORITY PREPARATION');actions.forEach((a,i)=>{lines.push(`${i+1}. ${a.title} [${a.domainName}]`);a.steps.forEach(x=>lines.push(`   - ${x}`));});
  lines.push('');lines.push('MEETING AND VERIFICATION');lines.push(`- Near meeting point: ${card.meetingPoints[0]}`);lines.push(`- Far meeting point: ${card.meetingPoints[1]}`);lines.push(`- Out-of-area relay: ${card.outOfAreaRelay.name}`);lines.push(`- Verification rule: ${card.verification}`);
  lines.push('');lines.push('BOUNDARY');lines.push('- This is a planning tool, not an emergency service, medical device, legal service or survival guarantee.');lines.push('- Follow verified local official instructions during an actual emergency.');
  return lines.join('\n');
}

const api={VERSION,MODE,DOMAINS,WORLDS,SIGNALS,ACTION_LIBRARY,DEFAULT_STATE,DEMO_STATE,normalizeState,domainScores,worldResults,readinessSummary,triggerMode,getPriorityActions,emergencyActions,buildKitList,scanUrgentMessage,evaluateAiAction,createReceipt,verifyReceipts,buildEmergencyCard,generateDrill,buildContinuityPackage,exportTextPlan,stableStringify,simpleHash,clamp};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
global.ShengzhouCore=api;
})(typeof window!=='undefined'?window:globalThis);
