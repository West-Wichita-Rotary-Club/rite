// Basic build/lint validation: every docs/js source file must at least
// parse cleanly. Uses only Node's built-in `--check`, no dependencies.
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const jsDir = "docs/js";
const files = readdirSync(jsDir)
  .filter((name) => name.endsWith(".js"))
  .map((name) => join(jsDir, name));

let failed = false;
for (const file of files) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    console.log(`ok    ${file}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL  ${file}`);
    console.error(error.stderr?.toString() || error.message);
  }
}

if (failed) {
  process.exit(1);
}
