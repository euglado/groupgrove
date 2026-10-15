import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const licenses = new Set(["MIT", "Apache-2.0", "MIT OR Apache-2.0", "0BSD"]);
let packages = 0;
for (const [name, entry] of Object.entries(lock.packages)) {
  if (!name) continue;
  assert(licenses.has(entry.license), `Review dependency license: ${name}`);
  assert(entry.resolved?.startsWith("https://registry.npmjs.org/"), `Unexpected registry: ${name}`);
  assert(/^sha512-[A-Za-z0-9+/]+=*$/.test(entry.integrity ?? ""), `Missing integrity: ${name}`);
  assert(!entry.hasInstallScript, `Unexpected install script: ${name}`);
  packages++;
}
const excluded = new Set([".git", "node_modules"]);
let files = 0;
const secretPatterns = [
  /(?:gh[pousr])_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{30,}/,
  /mfa\.[A-Za-z0-9_-]{40,}/,
  /[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{25,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];
function scan(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(item.name)) continue;
    const file = path.join(directory, item.name);
    assert(!item.isSymbolicLink(), "Unexpected source symlink");
    if (item.isDirectory()) scan(file);
    else {
      assert(
        !item.name.startsWith(".env") || item.name === ".env.example",
        "Secret environment file present",
      );
      assert(fs.statSync(file).size < 2000000, "Unexpected large source file");
      const body = fs.readFileSync(file, "utf8");
      assert(
        !secretPatterns.some((pattern) => pattern.test(body)),
        `Potential credential in ${path.relative(root, file)} (value withheld)`,
      );
      files++;
    }
  }
}
scan(root);
console.log(
  `Supply check: ${packages} dependency license/registry/SHA-512/no-install-script records; ${files} source credential-pattern scans passed. Pattern scans are not a guarantee.`,
);
