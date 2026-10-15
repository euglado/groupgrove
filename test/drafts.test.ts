import assert from "node:assert/strict";
import { test } from "node:test";
import { Drafts } from "../src/drafts.ts";
import { planGroups } from "../src/plan.ts";

const context = { owner: "member", guild: "guild", channel: "channel" };
const plan = planGroups(23, 4, 6);
test("drafts bind all context fields and message before one-use consumption", () => {
  const store = new Drafts();
  const id = store.create(context, plan, "tr");
  assert.match(id, /^[a-f0-9]{32}$/);
  assert.throws(() => store.take(id, context, "message"));
  store.bind(id, "message");
  for (const field of ["owner", "guild", "channel"] as const) {
    assert.throws(() => store.take(id, { ...context, [field]: "other" }, "message"));
  }
  assert.throws(() => store.take(id, context, "other"));
  assert.equal(store.take(id, context, "message").lang, "tr");
  assert.throws(() => store.take(id, context, "message"));
});
test("TTL expires exactly at five minutes and restart drops drafts", () => {
  let now = 0;
  const store = new Drafts(() => now);
  const id = store.create(context, plan, "en");
  store.bind(id, "message");
  now = 300000;
  assert.throws(() => store.take(id, context, "message"));
  assert.equal(store.entries.size, 0);
  assert.throws(() => new Drafts().take(id, context, "message"));
});
test("form throttle is per server/member and expires", () => {
  let now = 0;
  const store = new Drafts(() => now);
  store.form(context);
  assert.throws(() => store.form(context));
  store.form({ ...context, owner: "second" });
  now = 5000;
  store.form(context);
  assert.equal(store.forms.size, 1);
});
test("channel exclusion outlasts cooldown during an in-flight send", () => {
  let now = 0;
  const store = new Drafts(() => now);
  store.beginShare("one");
  assert.throws(() => store.beginShare("one"));
  store.beginShare("two");
  now = 60000;
  assert.throws(() => store.beginShare("one"));
  store.endShare("one");
  store.beginShare("one");
  store.endShare("one");
  assert.throws(() => store.beginShare("one"));
});
test("draft and cooldown storage is bounded and pruned", () => {
  let now = 0;
  const store = new Drafts(() => now);
  for (let n = 0; n < 100; n++) store.create(context, plan, "en");
  assert.throws(() => store.create(context, plan, "en"));
  now = 300000;
  store.create(context, plan, "en");
  assert.equal(store.entries.size, 1);
  for (let n = 0; n < 1000; n++) store.form({ ...context, owner: String(n) });
  assert.throws(() => store.form(context));
});
test("in-flight share capacity never evicts active locks", () => {
  const store = new Drafts();
  for (let n = 0; n < 100; n++) store.beginShare(String(n));
  assert.throws(() => store.beginShare("full"));
  store.endShare("0");
  store.beginShare("available");
  assert.equal(store.busy.size, 100);
});
