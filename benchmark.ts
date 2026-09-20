import { readFileSync } from "node:fs";

declare const Bun: { version: string } | undefined;

const bundlePath = process.argv[2];
const matchIndex = Number(process.argv[3] ?? "0");
const iterations = Number(process.argv[4] ?? "500000");
if (!bundlePath) {
  console.error("Usage: <bun|node> benchmark.ts <bundle.js> <match-index> [iterations]");
  process.exit(1);
}

const engine = typeof Bun !== "undefined" ? `bun ${Bun.version}` : `node ${process.versions.node}`;

const source = readFileSync(bundlePath, "utf8");
(globalThis as any).eval(source + "\nglobalThis.FindUpdateBench = FindUpdateBench;");

// Samples are kept in round order so warm-up drift stays visible in the output.
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

const sorted = [...samples].sort((a, b) => a - b);
console.log(JSON.stringify({
  bundlePath,
  engine,
  matchIndex,
  iterations,
  medianUsPerEvent: sorted[Math.floor(sorted.length / 2)],
  samples,
}));
