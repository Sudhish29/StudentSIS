import test from "node:test";
import assert from "node:assert";
import { average, gradeFor } from "../utils/grading.js";

test("average computes correctly", () => {
  assert.strictEqual(average([{ marks: 80 }, { marks: 90 }]), 85);
});

test("grade boundaries are correct", () => {
  assert.strictEqual(gradeFor(95), "A");
  assert.strictEqual(gradeFor(80), "B");
  assert.strictEqual(gradeFor(65), "C");
  assert.strictEqual(gradeFor(45), "D");
  assert.strictEqual(gradeFor(30), "F");
});
