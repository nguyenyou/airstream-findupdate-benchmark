import { readFileSync } from "node:fs";

const bundlePath = Bun.argv[2];
const matchIndex = Number(Bun.argv[3] ?? "0");
const iterations = Number(Bun.argv[4] ?? "500000");
if (!bundlePath) {
  console.error("Usage: bun benchmark.ts <bundle.js> <match-index> [iterations]");
  process.exit(1);
}

const source = readFileSync(bundlePath, "utf8");
(globalThis as any).eval(source + "\nglobalThis.FindUpdateBench = FindUpdateBench;");

const samples: number[] = [];
for (let round = 0; round < 9; round += 1) {
  const run = (globalThis as any).FindUpdateBench.setup(256, matchIndex);
  run(10000);
  const start = performance.now();
  const checksum = run(iterations);
  const elapsed = (performance.now() - start) * 1000 / iterations;
  if (!Number.isFinite(checksum)) {
    throw new Error("Benchmark checksum was not finite");
  }
  samples.push(elapsed);
}

samples.sort((a, b) => a - b);
console.log(JSON.stringify({
  bundlePath,
  matchIndex,
  iterations,
  medianUsPerEvent: samples[Math.floor(samples.length / 2)],
  samples,
}));
