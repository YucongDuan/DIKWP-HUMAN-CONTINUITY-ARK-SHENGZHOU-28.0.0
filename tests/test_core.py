from __future__ import annotations

import json
import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "python"))

from shengzhou.core import (  # noqa: E402
    DOMAIN_IDS, MODE, VERSION, append_receipt, assess, build_demo_state,
    build_package, digest, domain_scores, normalize_state, verify_receipts, world_results,
)


class ShengzhouCoreTests(unittest.TestCase):
    def test_version(self):
        self.assertEqual(VERSION, "28.0.0")

    def test_mode(self):
        self.assertIn("AGI_DISCONTINUITY", MODE)

    def test_domains(self):
        self.assertEqual(len(DOMAIN_IDS), 12)

    def test_scores_bounded(self):
        for value in domain_scores(normalize_state()).values():
            self.assertGreaterEqual(value, 0)
            self.assertLessEqual(value, 1)

    def test_demo_is_stronger(self):
        self.assertGreater(assess(build_demo_state())["robustFloor"], assess(normalize_state())["robustFloor"])

    def test_world_count(self):
        self.assertEqual(len(world_results(normalize_state())), 8)

    def test_robust_floor(self):
        result = assess(build_demo_state())
        self.assertEqual(result["robustFloor"], min(w["floor"] for w in result["worlds"]))

    def test_receipt_chain(self):
        state = append_receipt(normalize_state(), "A", {"x": 1})
        state = append_receipt(state, "B", {"y": 2})
        self.assertTrue(verify_receipts(state["receipts"])["valid"])

    def test_receipt_tamper(self):
        state = append_receipt(normalize_state(), "A", {"x": 1})
        state["receipts"][0]["payload"]["x"] = 2
        self.assertFalse(verify_receipts(state["receipts"])["valid"])

    def test_package(self):
        package = build_package(build_demo_state())
        self.assertEqual(package["version"], VERSION)
        self.assertTrue(package["boundaries"]["noExternalAutomaticAction"])
        self.assertEqual(len(package["integrity"]["payloadDigest"]), 64)

    def test_digest_is_deterministic(self):
        self.assertEqual(digest({"b": 1, "a": 2}), digest({"a": 2, "b": 1}))

    def test_severity_zero(self):
        state = build_demo_state()
        for world in state["worlds"]:
            if world["id"] == "compound_crisis":
                world["severity"] = 0
        base = domain_scores(state)
        compound = next(w for w in world_results(state) if w["id"] == "compound_crisis")
        self.assertAlmostEqual(compound["scores"]["finance"], base["finance"])


if __name__ == "__main__":
    unittest.main()
