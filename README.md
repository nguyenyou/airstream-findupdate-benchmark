# Airstream `findUpdate` benchmark

This repository contains the Scala.js source and CI workflow used to compare the generic and specialized `Vector.findUpdate` implementations.

Run locally with [Bun](https://bun.sh/):

```sh
sbt before/fullOptJS after/fullOptJS
bun benchmark.ts before/target/scala-3.9.0/airstream-findupdate-before-opt/main.js 0
bun benchmark.ts after/target/scala-3.9.0/airstream-findupdate-after-opt/main.js 0
```

Every push and manual workflow run builds both bundles from the Scala sources, executes the benchmark, publishes the runtime and bundle-size comparison in the GitHub Actions job summary, and uploads the generated JavaScript files.

The CI benchmark covers matches at indexes 0, 128, and 255, plus no match. It uses a 256-element `Vector`, warms up for 10,000 updates, and reports the median of 9 rounds of 500,000 updates. Runtime results are reported as both time reduction and throughput ratio. Bundle size is labeled as standalone linker overhead; it is not the marginal size impact in a real application.
