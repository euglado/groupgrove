import assert from "node:assert/strict";
import { test } from "node:test";
import { InputError, planGroups, renderPlan } from "../src/plan.ts";

test("23 people default to four balanced groups", () => {
  const plan = planGroups(23, 4, 6);
  assert.equal(plan.groups, 4);
  assert.equal(plan.largeCount, 3);
  assert.equal(plan.largeSize, 6);
  assert.equal(plan.smallCount, 1);
  assert.equal(plan.smallSize, 5);
  assert.equal(plan.lastFeasible, 5);
});
test("explicit five-group alternative keeps everyone", () => {
  const p = planGroups(23, 4, 6, 5);
  assert.equal(p.largeCount, 3);
  assert.equal(p.largeSize, 5);
  assert.equal(p.smallCount, 2);
  assert.equal(p.smallSize, 4);
});
test("equal groups show no phantom larger group", () => {
  const p = planGroups(20, 5, 5);
  assert.equal(p.largeCount, 0);
  assert.match(renderPlan(p, "en"), /4 × 5/);
  assert.doesNotMatch(renderPlan(p, "en"), /× 6/);
});
for (const value of [NaN, Infinity, 2.5, 1, 1001, -1]) {
  test(`reject invalid participant count ${value}`, () =>
    assert.throws(() => planGroups(value, 2, 5), InputError));
}
for (const values of [
  [5, 6, 5],
  [3, 2, 2],
  [10, 1, 5],
  [10, 2, 51],
  [20, 2.5, 5],
  [20, 2, 5, 3],
  [20, 2, 5, 11],
  [20, 2, 5, 4.5],
  [20, 2, 5, 0],
]) {
  test(`reject impossible limits ${values.join(",")}`, () =>
    assert.throws(
      () => planGroups(values[0] as number, values[1] as number, values[2] as number, values[3]),
      InputError,
    ));
}
test("exhaustive small cases agree with independent feasibility enumeration", () => {
  for (let people = 2; people <= 120; people++) {
    for (let min = 2; min <= 12; min++) {
      for (let max = min; max <= 12; max++) {
        const valid = [];
        for (let groups = 1; groups <= people; groups++) {
          if (groups * min <= people && groups * max >= people) valid.push(groups);
        }
        if (!valid.length) {
          assert.throws(() => planGroups(people, min, max), InputError);
          continue;
        }
        for (const groups of [valid[0], valid.at(-1)]) {
          const p = planGroups(people, min, max, groups);
          assert.equal(p.smallCount * p.smallSize + p.largeCount * p.largeSize, people);
          assert.equal(p.smallCount + p.largeCount, groups);
          assert(p.smallSize >= min && (p.largeCount ? p.largeSize : p.smallSize) <= max);
          assert(p.largeSize - p.smallSize <= 1);
          assert.equal(p.firstFeasible, valid[0]);
          assert.equal(p.lastFeasible, valid.at(-1));
        }
      }
    }
  }
});
test("maximum case and both languages fit Discord content limits", () => {
  for (const lang of ["en", "tr"] as const) {
    const text = renderPlan(planGroups(1000, 2, 50, 500), lang);
    assert(text.length < 1600);
    assert(!/@|https?:/.test(text));
    assert.match(text, /500 × 2/);
  }
});
