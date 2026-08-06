import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const steps = [
  ["theme generation", "npm", ["run", "theme:generate"]],
  ["release validation", "npm", ["run", "release:validate"]],
  ["static architecture audit", "npm", ["run", "audit:static"]],
  ["TypeScript", "npm", ["run", "typecheck"]],
  ["production build", "npm", ["run", "build"]],
];

for (const [label, command, args] of steps) {
  console.log(`\n==> ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (existsSync("node_modules/@playwright/test")) {
  console.log("\n==> Playwright smoke tests");
  const result = spawnSync("npm", ["run", "test:e2e"], { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
} else {
  console.warn("\nWARN: Playwright is not installed; browser smoke tests were not run.");
}
