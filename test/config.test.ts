import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { PermissionFlagsBits } from "discord.js";
import { command } from "../src/command.ts";
import { config } from "../src/config.ts";

test("config fails safely on missing data, invalid IDs and newline injection", () => {
  assert.throws(() => config({}));
  const base = {
    DISCORD_TOKEN: "x".repeat(40),
    APPLICATION_ID: "123456789012345678",
    GUILD_ID: "234567890123456789",
  };
  assert.equal(config(base).guild, base.GUILD_ID);
  for (const key of Object.keys(base)) {
    assert.throws(() => config({ ...base, [key]: "bad\nINJECT=value" }));
  }
});
test("command matches guild-create API fields, manager permissions and bounded input", () => {
  const json = command.toJSON();
  const supported = new Set([
    "name",
    "name_localizations",
    "description",
    "description_localizations",
    "options",
    "default_member_permissions",
    "type",
    "nsfw",
  ]);
  for (const [key, value] of Object.entries(json)) {
    if (value !== undefined) assert(supported.has(key), `Unsupported guild command field: ${key}`);
  }
  assert.equal(json.default_member_permissions, String(PermissionFlagsBits.ManageGuild));
  assert.equal(json.options?.length, 5);
  assert.doesNotThrow(() => JSON.stringify(json));
});
for (const relative of ["src/main.ts", "src/register.ts", "scripts/setup.mjs"]) {
  test(`${relative} actually exits safely without config or file writes`, () => {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "groupgrove-test-"));
    const parent = fs.realpathSync(os.tmpdir());
    const resolved = fs.realpathSync(temporary);
    assert(
      path.dirname(resolved) === parent && path.basename(resolved).startsWith("groupgrove-test-"),
    );
    try {
      const env = { ...process.env };
      for (const key of ["DISCORD_TOKEN", "APPLICATION_ID", "GUILD_ID", "NODE_OPTIONS"])
        delete env[key];
      const root = fileURLToPath(new URL("../", import.meta.url));
      const run = spawnSync(process.execPath, [path.join(root, relative)], {
        cwd: temporary,
        env,
        encoding: "utf8",
        timeout: 10000,
      });
      assert.equal(run.status, 1, run.stderr);
      assert.deepEqual(fs.readdirSync(temporary), []);
      assert(!run.stderr.includes("x".repeat(40)));
    } finally {
      fs.rmSync(resolved, { recursive: true });
    }
  });
}
