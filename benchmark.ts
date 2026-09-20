import { readFileSync } from "node:fs";

const bundlePath = Bun.argv[2];
if (!bundlePath) {
  console.error("Usage: bun benchmark.ts <bundle.js>");
  process.exit(1);
}

const source = readFileSync(bundlePath, "utf8");
(globalThis as any).eval(source + "\nglobalThis.FindUpdateBench = FindUpdateBench;");

const samples: number[] = [];
for (let round = 0; round < 15; round += 1) {
  const run = (globalThis as any).FindUpdateBench.setup(256, 0);
  run(1000);
  const start = performance.now();
  const checksum = run(10000);
  const elapsed = (performance.now() - start) * 1000 / 10000;
  if (!Number.isFinite(checksum)) {
    throw new Error("Benchmark checksum was not finite");
  }
  samples.push(elapsed);
}

samples.sort((a, b) => a - b);
console.log(JSON.stringify({
  bundlePath,
  medianUsPerEvent: samples[Math.floor(samples.length / 2)],
  samples,
}));
