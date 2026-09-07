# SHENGZHOU Personal Continuity Protocol 28.0.0 — Draft

## Status

Source-team draft and reference implementation. No governmental, emergency-management, standards, medical or financial authority has certified this protocol.

## 1. Required objects

A conforming implementation MUST support:

1. a Personal or Household Continuity Passport;
2. twelve non-compensatory life floors;
3. at least two non-isomorphic disruption worlds;
4. observable signals and activation levels;
5. an AI Authority Mandate and action gate;
6. trusted contacts and independent-channel verification;
7. a bounded action plan;
8. drills and outcome records;
9. append-only decision receipts;
10. user-controlled export and revocation.

## 2. Hard invariants

```text
EXTERNAL_AUTOMATIC_ACTION_AUTHORITY = 0
EXTERNAL_AUTOMATIC_VALUE_TRANSFER_AUTHORITY = 0
AGENT_SELF_AUTHORIZATION = 0
HUMAN_WORTH_RANKING_AUTHORITY = 0
HUMAN_FINAL_CONFIRMATION_FOR_IRREVERSIBLE_ACTIONS = 1
REALITY_CONTACT_REQUIRED = 1
USER_REVOCATION_PRECEDENCE = 1
MINIMUM_NON_ISOMORPHIC_WORLDS = 2
```

## 3. Activation levels

- L0 baseline readiness;
- L1 verify and prepare;
- L2 continuity mode;
- L3 protective isolation;
- L4 life-safety and relocation.

Activation MUST be based on observable signals, not unsupported claims that AGI has “awakened.”

## 4. Data minimization

A conforming personal client SHOULD be local-first and MUST warn against storage of authentication secrets, private keys, full identity documents and real family challenge answers.

## 5. Claim boundaries

Readiness scores are planning signals, not calibrated probabilities, emergency forecasts, credit scores, insurance eligibility or human-worth rankings.

## 6. Corrections

A user correction or drill outcome MUST be able to revise the state and create a new receipt without silently deleting the earlier record.
