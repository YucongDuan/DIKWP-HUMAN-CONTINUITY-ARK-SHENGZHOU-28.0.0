from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

from .core import VERSION, MODE, assess, build_demo_state, build_package, normalize_state, verify_receipts


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"Input file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def cmd_summary(_: argparse.Namespace) -> int:
    print(json.dumps({"name": "DIKWP HUMAN CONTINUITY ARK / SHENGZHOU", "version": VERSION,
                      "mode": MODE, "purpose": "Personal and household continuity under AGI-era disruptions",
                      "externalAutomaticActionAuthority": 0}, ensure_ascii=False, indent=2))
    return 0


def cmd_demo(args: argparse.Namespace) -> int:
    out = Path(args.out)
    state = build_demo_state()
    package = build_package(state)
    write_json(out / "shengzhou28-demo-state.json", state)
    write_json(out / "shengzhou28-demo.hcpkg.json", package)
    report = assess(state)
    write_json(out / "shengzhou28-demo-assessment.json", report)
    print(json.dumps({"out": str(out), "robustFloor": report["robustFloor"],
                      "weakestWorld": report["weakestWorld"]["id"], "receipts": len(state["receipts"])}, indent=2))
    return 0


def cmd_assess(args: argparse.Namespace) -> int:
    state = normalize_state(read_json(Path(args.input)))
    result = assess(state)
    if args.out:
        write_json(Path(args.out), result)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


def cmd_build_package(args: argparse.Namespace) -> int:
    state = normalize_state(read_json(Path(args.input)))
    package = build_package(state)
    write_json(Path(args.out), package)
    print(Path(args.out))
    return 0


def cmd_verify(args: argparse.Namespace) -> int:
    value = read_json(Path(args.input))
    result = verify_receipts(value.get("receipts", []))
    print(json.dumps(result, indent=2))
    return 0 if result.get("valid") else 1


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="shengzhou28", description="SHENGZHOU 28 personal continuity CLI")
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("summary"); p.set_defaults(func=cmd_summary)
    p = sub.add_parser("demo"); p.add_argument("--out", default="outputs/demo"); p.set_defaults(func=cmd_demo)
    p = sub.add_parser("assess"); p.add_argument("input"); p.add_argument("--out"); p.set_defaults(func=cmd_assess)
    p = sub.add_parser("build-package"); p.add_argument("input"); p.add_argument("--out", required=True); p.set_defaults(func=cmd_build_package)
    p = sub.add_parser("verify-ledger"); p.add_argument("input"); p.set_defaults(func=cmd_verify)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":
    sys.exit(main())
