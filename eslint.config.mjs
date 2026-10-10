import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals, ...nextTypescript,
  // Existing animation controllers synchronize with browser layout. Keep the
  // established effects; exercise their behavior through navigation tests.
  { rules: { "react-hooks/set-state-in-effect": "off", "react-hooks/refs": "off" } },
  globalIgnores([".next/**", "node_modules/**", "playwright-report/**", "test-results/**", "next-env.d.ts"]),
]);
