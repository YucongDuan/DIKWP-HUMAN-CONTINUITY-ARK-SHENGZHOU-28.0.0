# AI Authority Firewall / AI权限防火墙

## 1. Five separate questions

For every AI or agent action, ask:

1. Can the system technically do it?
2. Was this exact purpose authorized?
3. Is the target within scope?
4. Is the action reversible?
5. Will a named human review the final irreversible step?

## 2. Decision classes

```text
ALLOW_LOCAL_REVERSIBLE_ANALYSIS
HOLD_FOR_NAMED_HUMAN_CONFIRMATION
HOLD_FOR_FINAL_NAMED_HUMAN_CONFIRMATION
DENY
```

## 3. Never-autonomous classes in the personal reference profile

- transfer money or crypto;
- borrow, invest or open an account;
- sign or accept contracts;
- change legal identity or entitlement data;
- diagnose, prescribe or change medication;
- file legal claims or waive rights;
- unlock a home, vehicle or physical access control;
- relocate dependents;
- publish private accusations;
- rank human worth;
- extend the agent's own permissions or persistence.

## 4. Permission hygiene

Maintain an inventory of apps, browser extensions, OAuth grants, email/calendar delegates, smart-home controllers and payment agents. Grant the shortest duration and narrowest scope. Review activity independently of the model's own explanation. Revoke access when the purpose ends.

## 5. Emergency mode

When a credible incident is suspected, freeze new automation, revoke high-risk grants, change recovery credentials from a clean device, preserve logs, and re-enable capabilities one by one after verification.
