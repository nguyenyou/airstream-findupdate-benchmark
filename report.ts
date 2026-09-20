import { readFileSync, statSync } from "node:fs";

const beforeBundle = process.argv[2];
const afterBundle = process.argv[3];
const resultPaths = process.argv.slice(4);
const resultsByEngine = new Map<string, { before: any; after: any }[]>();
for (let i = 0; i < resultPaths.length; i += 2) {
  const before = JSON.parse(readFileSync(resultPaths[i], "utf8"));
  const after = JSON.parse(readFileSync(resultPaths[i + 1], "utf8"));
  if (before.engine !== after.engine || before.matchIndex !== after.matchIndex) {
    throw new Error(`Mismatched result pair: ${resultPaths[i]} vs ${resultPaths[i + 1]}`);
  }
  const results = resultsByEngine.get(before.engine) ?? [];
  results.push({ before, after });
  resultsByEngine.set(before.engine, results);
}
const beforeBytes = statSync(beforeBundle).size;
const afterBytes = statSync(afterBundle).size;
const sizeDelta = afterBytes - beforeBytes;

console.log("## Airstream `Vector.findUpdate` benchmark");
console.log("");
console.log("Standalone benchmark bundle size:");
console.log(`- Before: ${beforeBytes.toLocaleString()} bytes`);
console.log(`- After: ${afterBytes.toLocaleString()} bytes`);
console.log(`- Delta: ${sizeDelta >= 0 ? "+" : ""}${sizeDelta.toLocaleString()} bytes`);
for (const [engine, results] of resultsByEngine) {
  console.log("");
  console.log(`### ${engine}`);
  console.log("");
  console.log("| Match | Before (µs/event) | After (µs/event) | Less time | Throughput ratio |");
  console.log("|---:|---:|---:|---:|---:|");
  for (const result of results) {
    const before = result.before.medianUsPerEvent;
    const after = result.after.medianUsPerEvent;
    const lessTime = (1 - after / before) * 100;
    const throughput = before / after;
    const label = result.before.matchIndex === -1 ? "none" : result.before.matchIndex;
    console.log(`| ${label} | ${before.toFixed(4)} | ${after.toFixed(4)} | ${lessTime.toFixed(1)}% | ${throughput.toFixed(1)}× |`);
  }
}
console.log("");
console.log("Each case uses a 256-element Vector, 9 rounds, and 500,000 measured updates per round. Bundle size is standalone linker overhead, not application marginal cost.");
