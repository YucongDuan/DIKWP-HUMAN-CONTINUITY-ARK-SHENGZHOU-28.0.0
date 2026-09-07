from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from hashlib import sha256
import json
from typing import Any, Iterable

VERSION = "28.0.0"
MODE = "SHENGZHOU28_AGI_DISCONTINUITY_LIFE_FLOOR_INFORMATION_INTEGRITY_DIGITAL_SOVEREIGNTY_COMMUNITY_RECOVERY_REALITY_CLOSURE"

DOMAIN_IDS = (
    "supplies", "health", "shelter", "communication", "identity", "finance",
    "digital", "information", "ai_authority", "mobility", "community", "psychological",
)

WORLDS: tuple[dict[str, Any], ...] = (
    {"id": "rapid_automation", "name": "Rapid automation and income shock", "weight": 0.16,
     "impact": {"supplies": .92, "health": .90, "shelter": .92, "communication": .96, "identity": .96, "finance": .48, "digital": .90, "information": .82, "ai_authority": .78, "mobility": .90, "community": .82, "psychological": .62}},
    {"id": "ai_fraud", "name": "AI-enabled fraud, impersonation and influence", "weight": 0.14,
     "impact": {"supplies": .96, "health": .86, "shelter": .96, "communication": .52, "identity": .52, "finance": .48, "digital": .62, "information": .42, "ai_authority": .50, "mobility": .88, "community": .72, "psychological": .70}},
    {"id": "cyber_identity", "name": "Cyber compromise and identity lockout", "weight": 0.14,
     "impact": {"supplies": .92, "health": .82, "shelter": .90, "communication": .58, "identity": .40, "finance": .50, "digital": .38, "information": .66, "ai_authority": .54, "mobility": .84, "community": .78, "psychological": .72}},
    {"id": "cloud_payment_outage", "name": "Cloud, payment and communications outage", "weight": 0.13,
     "impact": {"supplies": .72, "health": .72, "shelter": .78, "communication": .44, "identity": .62, "finance": .38, "digital": .46, "information": .58, "ai_authority": .72, "mobility": .66, "community": .72, "psychological": .78}},
    {"id": "essential_services", "name": "Essential-service and supply disruption", "weight": 0.13,
     "impact": {"supplies": .40, "health": .44, "shelter": .48, "communication": .72, "identity": .86, "finance": .70, "digital": .64, "information": .66, "ai_authority": .84, "mobility": .60, "community": .58, "psychological": .68}},
    {"id": "autonomous_agent_incident", "name": "Autonomous-agent or system-control incident", "weight": 0.12,
     "impact": {"supplies": .86, "health": .72, "shelter": .80, "communication": .62, "identity": .54, "finance": .52, "digital": .42, "information": .50, "ai_authority": .34, "mobility": .76, "community": .72, "psychological": .66}},
    {"id": "local_relocation", "name": "Local safety failure and temporary relocation", "weight": 0.10,
     "impact": {"supplies": .56, "health": .58, "shelter": .36, "communication": .54, "identity": .60, "finance": .64, "digital": .62, "information": .68, "ai_authority": .84, "mobility": .34, "community": .52, "psychological": .56}},
    {"id": "compound_crisis", "name": "Compound discontinuity", "weight": 0.08,
     "impact": {"supplies": .38, "health": .40, "shelter": .42, "communication": .36, "identity": .40, "finance": .32, "digital": .30, "information": .34, "ai_authority": .32, "mobility": .38, "community": .42, "psychological": .38}},
)

DEFAULT_PREPAREDNESS: dict[str, Any] = {
    "waterDays": 1, "foodDays": 3, "medicationDays": 5, "hygieneDays": 3, "kitCompletion": .25,
    "medicalSummary": False, "firstAid": False, "prescriptionCopies": False, "careBackup": False,
    "professionalSupportContact": False, "powerBackupHours": 2, "shelterPlan": False, "smokeAlarm": True,
    "utilityShutoffKnowledge": False, "alternativeTemperaturePlan": False, "trustedContacts": 1,
    "outOfAreaContact": False, "meetingPoints": 0, "offlineRadio": False, "paperContacts": False,
    "twoChannelVerification": False, "documentCopies": False, "recoveryCodes": False,
    "cleanDevicePlan": False, "officialAccountContacts": False, "secureStorage": False, "cashDays": 1,
    "reserveDays": 5, "paymentRails": 1, "incomeSources": 1, "billList": False, "fraudFreezePlan": False,
    "mfaCoverage": .35, "passwordManager": False, "offlineBackups": 0, "softwareUpdates": True,
    "accountRecovery": False, "oauthReview": False, "officialSources": 1, "twoSourceRule": False,
    "pauseBeforeShare": True, "rumorLog": False, "offlineSourceList": False, "sourceDiversity": False,
    "humanConfirmCritical": False, "noAutoTransfer": False, "noAutoContract": False, "revocationPlan": False,
    "agentInventory": False, "leastPrivilege": False, "goBag": False, "routes": 0, "transportBackup": False,
    "destinationPlan": False, "petPlan": False, "mutualAidContacts": 1, "vulnerableCheck": False,
    "skillOffer": False, "sharedResources": False, "localOrganizations": False, "transferableSkills": 1,
    "workEvidence": 0, "ninetyDayIncomePlan": False, "localServiceSkill": False, "checkInPeople": 1,
    "sleepPlan": False, "calmProtocol": False, "mediaLimit": False, "dependentRoutine": False,
    "drillsCompleted": 0,
}


def _clamp(value: Any, lo: float = 0.0, hi: float = 1.0) -> float:
    try:
        number = float(value)
    except (TypeError, ValueError):
        number = 0.0
    return max(lo, min(hi, number))


def _ratio(value: Any, target: float) -> float:
    try:
        return _clamp(float(value) / target)
    except (TypeError, ValueError, ZeroDivisionError):
        return 0.0


def _avg(values: Iterable[float]) -> float:
    values = list(values)
    return sum(values) / len(values) if values else 0.0


def _b(value: Any) -> float:
    return 1.0 if bool(value) else 0.0


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def digest(value: Any) -> str:
    return sha256(canonical(value).encode("utf-8")).hexdigest()


def normalize_state(value: dict[str, Any] | None = None) -> dict[str, Any]:
    base = {
        "meta": {"version": VERSION, "mode": MODE, "createdAt": utc_now(), "updatedAt": utc_now()},
        "profile": {"displayName": "My household", "householdSize": 1, "children": 0, "olderAdults": 0,
                    "disabilityOrMedicalDependency": False, "pets": 0, "jurisdiction": ""},
        "preparedness": deepcopy(DEFAULT_PREPAREDNESS),
        "worlds": [{"id": w["id"], "weight": w["weight"], "severity": 1.0} for w in WORLDS],
        "signals": [], "trustedSources": [], "contacts": [], "drills": [], "receipts": [],
    }
    if value:
        for key in ("meta", "profile", "preparedness"):
            if isinstance(value.get(key), dict):
                base[key].update(value[key])
        for key in ("worlds", "signals", "trustedSources", "contacts", "drills", "receipts"):
            if isinstance(value.get(key), list):
                base[key] = deepcopy(value[key])
    base["meta"].update({"version": VERSION, "mode": MODE, "updatedAt": utc_now()})
    return base


def domain_scores(state: dict[str, Any]) -> dict[str, float]:
    s = normalize_state(state)
    p = s["preparedness"]
    profile = s["profile"]
    scores = {
        "supplies": _avg((_ratio(p["waterDays"], 3), _ratio(p["foodDays"], 14), _ratio(p["hygieneDays"], 7), _clamp(p["kitCompletion"]))),
        "health": _avg((_ratio(p["medicationDays"], 14), _b(p["medicalSummary"]), _b(p["firstAid"]), _b(p["prescriptionCopies"]), _b(p["careBackup"]), _b(p["professionalSupportContact"]))),
        "shelter": _avg((_ratio(p["powerBackupHours"], 24), _b(p["shelterPlan"]), _b(p["smokeAlarm"]), _b(p["utilityShutoffKnowledge"]), _b(p["alternativeTemperaturePlan"]))),
        "communication": _avg((_ratio(p["trustedContacts"], 3), _b(p["outOfAreaContact"]), _ratio(p["meetingPoints"], 2), _b(p["offlineRadio"]), _b(p["paperContacts"]), _b(p["twoChannelVerification"]))),
        "identity": _avg((_b(p["documentCopies"]), _b(p["recoveryCodes"]), _b(p["cleanDevicePlan"]), _b(p["officialAccountContacts"]), _b(p["secureStorage"]))),
        "finance": _avg((_ratio(p["cashDays"], 7), _ratio(p["reserveDays"], 30), _ratio(p["paymentRails"], 2), _ratio(p["incomeSources"], 2), _b(p["billList"]), _b(p["fraudFreezePlan"]), _ratio(p["transferableSkills"], 3), _ratio(p["workEvidence"], 2), _b(p["ninetyDayIncomePlan"]), _b(p["localServiceSkill"]))),
        "digital": _avg((_clamp(p["mfaCoverage"]), _b(p["passwordManager"]), _ratio(p["offlineBackups"], 2), _b(p["softwareUpdates"]), _b(p["accountRecovery"]), _b(p["oauthReview"]))),
        "information": _avg((_ratio(p["officialSources"], 3), _b(p["twoSourceRule"]), _b(p["pauseBeforeShare"]), _b(p["rumorLog"]), _b(p["offlineSourceList"]), _b(p["sourceDiversity"]))),
        "ai_authority": _avg((_b(p["humanConfirmCritical"]), _b(p["noAutoTransfer"]), _b(p["noAutoContract"]), _b(p["revocationPlan"]), _b(p["agentInventory"]), _b(p["leastPrivilege"]))),
        "mobility": _avg((_b(p["goBag"]), _ratio(p["routes"], 2), _b(p["transportBackup"]), _ratio(p["meetingPoints"], 2), _b(p["destinationPlan"]), _b(p["petPlan"] or int(profile.get("pets", 0)) == 0))),
        "community": _avg((_ratio(p["mutualAidContacts"], 3), _b(p["vulnerableCheck"]), _b(p["skillOffer"]), _b(p["sharedResources"]), _b(p["localOrganizations"]))),
        "psychological": _avg((_ratio(p["checkInPeople"], 2), _b(p["sleepPlan"]), _b(p["calmProtocol"]), _b(p["mediaLimit"]), _b(p["dependentRoutine"] or int(profile.get("children", 0)) == 0))),
    }
    return {key: _clamp(value) for key, value in scores.items()}


def world_results(state: dict[str, Any]) -> list[dict[str, Any]]:
    s = normalize_state(state)
    base = domain_scores(s)
    overrides = {w.get("id"): w for w in s.get("worlds", []) if isinstance(w, dict)}
    results: list[dict[str, Any]] = []
    for world in WORLDS:
        override = overrides.get(world["id"], {})
        severity = _clamp(override.get("severity", 1.0))
        weight = _clamp(override.get("weight", world["weight"]))
        scores = {}
        for domain in DOMAIN_IDS:
            impact = float(world["impact"].get(domain, 1.0))
            effective_impact = 1.0 - severity * (1.0 - impact)
            scores[domain] = _clamp(base[domain] * effective_impact)
        weakest = sorted(scores.items(), key=lambda item: item[1])[:3]
        results.append({"id": world["id"], "name": world["name"], "weight": weight, "severity": severity,
                        "scores": scores, "floor": min(scores.values()), "weakest": weakest})
    return results


def assess(state: dict[str, Any]) -> dict[str, Any]:
    base = domain_scores(state)
    worlds = world_results(state)
    total_weight = sum(w["weight"] for w in worlds) or 1.0
    return {
        "base": base,
        "worlds": worlds,
        "robustFloor": min(w["floor"] for w in worlds),
        "weightedFloor": sum(w["weight"] * w["floor"] for w in worlds) / total_weight,
        "weakestBase": sorted(base.items(), key=lambda item: item[1]),
        "weakestWorld": min(worlds, key=lambda item: item["floor"]),
    }


def append_receipt(state: dict[str, Any], event_type: str, payload: dict[str, Any]) -> dict[str, Any]:
    s = normalize_state(state)
    previous = s["receipts"][-1]["hash"] if s["receipts"] else "GENESIS"
    receipt = {"id": f"rcpt-{len(s['receipts']) + 1:06d}", "version": VERSION, "time": utc_now(),
               "eventType": event_type, "payload": payload, "previousHash": previous}
    receipt["hash"] = digest(receipt)
    s["receipts"].append(receipt)
    return s


def verify_receipts(receipts: list[dict[str, Any]]) -> dict[str, Any]:
    previous = "GENESIS"
    for receipt in receipts:
        if receipt.get("previousHash") != previous:
            return {"valid": False, "reason": f"previous hash mismatch at {receipt.get('id')}"}
        copy = dict(receipt)
        observed = copy.pop("hash", None)
        if digest(copy) != observed:
            return {"valid": False, "reason": f"hash mismatch at {receipt.get('id')}"}
        previous = str(observed)
    return {"valid": True, "count": len(receipts), "head": previous}


def build_package(state: dict[str, Any]) -> dict[str, Any]:
    s = normalize_state(state)
    result = assess(s)
    package = {
        "schema": "https://example.org/dikwp/shengzhou/28/personal-continuity-package",
        "version": VERSION, "mode": MODE, "generatedAt": utc_now(), "profile": s["profile"],
        "preparedness": s["preparedness"], "worlds": s["worlds"], "readiness": result,
        "trustedSources": s["trustedSources"], "contacts": s["contacts"], "drills": s["drills"],
        "receipts": s["receipts"],
        "boundaries": {"notEmergencyService": True, "notMedicalAdvice": True, "notFinancialAdvice": True,
                       "noExternalAutomaticAction": True, "noHumanWorthRanking": True, "noSecrets": True},
    }
    package["integrity"] = {"algorithm": "sha256", "payloadDigest": digest(package)}
    return package


def build_demo_state() -> dict[str, Any]:
    state = normalize_state()
    state["profile"].update({"displayName": "Lin Household — synthetic example", "householdSize": 3,
                             "children": 1, "pets": 1, "jurisdiction": "Local jurisdiction"})
    state["preparedness"].update({
        "waterDays": 3, "foodDays": 12, "medicationDays": 14, "hygieneDays": 7, "kitCompletion": .74,
        "medicalSummary": True, "firstAid": True, "prescriptionCopies": True, "careBackup": True,
        "professionalSupportContact": True, "powerBackupHours": 18, "shelterPlan": True,
        "utilityShutoffKnowledge": True, "alternativeTemperaturePlan": True, "trustedContacts": 4,
        "outOfAreaContact": True, "meetingPoints": 2, "offlineRadio": True, "paperContacts": True,
        "twoChannelVerification": True, "documentCopies": True, "recoveryCodes": True,
        "cleanDevicePlan": True, "officialAccountContacts": True, "secureStorage": True,
        "cashDays": 5, "reserveDays": 45, "paymentRails": 3, "incomeSources": 2, "billList": True,
        "fraudFreezePlan": True, "mfaCoverage": .92, "passwordManager": True, "offlineBackups": 2,
        "accountRecovery": True, "oauthReview": True, "officialSources": 5, "twoSourceRule": True,
        "rumorLog": True, "offlineSourceList": True, "sourceDiversity": True, "humanConfirmCritical": True,
        "noAutoTransfer": True, "noAutoContract": True, "revocationPlan": True, "agentInventory": True,
        "leastPrivilege": True, "goBag": True, "routes": 2, "transportBackup": True,
        "destinationPlan": True, "petPlan": True, "mutualAidContacts": 4, "vulnerableCheck": True,
        "skillOffer": True, "sharedResources": True, "localOrganizations": True, "transferableSkills": 4,
        "workEvidence": 3, "ninetyDayIncomePlan": True, "localServiceSkill": True, "checkInPeople": 3,
        "sleepPlan": True, "calmProtocol": True, "mediaLimit": True, "dependentRoutine": True,
        "drillsCompleted": 2,
    })
    state = append_receipt(state, "DEMO_INITIALIZED", {"synthetic": True})
    return state
