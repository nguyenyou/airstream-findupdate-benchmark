# Airstream `findUpdate` benchmark

This repository contains a small standalone Scala.js model of the generic and specialized `Vector.findUpdate` method bodies. It is designed to compare the algorithms in isolation; it is not a full Airstream or Laminar application bundle.

Run locally with [Bun](https://bun.sh/) or Node 24:

```sh
sbt before/fullOptJS after/fullOptJS
bun benchmark.ts before/target/scala-3.9.0/airstream-findupdate-before-opt/main.js 0
bun benchmark.ts after/target/scala-3.9.0/airstream-findupdate-after-opt/main.js 0
node benchmark.ts before/target/scala-3.9.0/airstream-findupdate-before-opt/main.js 0
```

Every push and manual workflow run builds both bundles from the Scala sources, executes the benchmark under Bun (JavaScriptCore) and Node (V8), publishes the runtime and bundle-size comparison per engine in the GitHub Actions job summary, and uploads the generated JavaScript files and raw results.

The CI benchmark covers matches at indexes 0, 128, and 255, plus no match. It uses a 256-element `Vector`, warms up for 10,000 updates, and reports the median of 9 rounds of 500,000 updates. Each result file records the engine version and the samples in round order, so warm-up drift stays visible. Runtime results are reported as both time reduction and throughput ratio. Bundle size is standalone linker overhead; it is not the marginal size impact in a real application. CI pins Scala 3.9.0, Scala.js 1.22.0, sbt 1.10.7, Java 25, Bun 1.4.2, and Node 24.
