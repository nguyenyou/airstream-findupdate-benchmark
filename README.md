# Airstream `findUpdate` benchmark

This repository contains the Scala.js source and CI workflow used to compare the generic and specialized `Vector.findUpdate` implementations.

Run locally with [Bun](https://bun.sh/):

```sh
sbt before/fullOptJS after/fullOptJS
bun benchmark.ts before/target/scala-3.3.3/airstream-findupdate-before-opt/main.js
bun benchmark.ts after/target/scala-3.3.3/airstream-findupdate-after-opt/main.js
```

Every push and manual workflow run builds both bundles from the Scala sources, executes the benchmark, publishes the runtime and bundle-size comparison in the GitHub Actions job summary, and uploads the generated JavaScript files.

The benchmark uses a 256-element `Vector`, matches the first element, warms up for 1,000 updates, and reports the median of 15 measured rounds of 10,000 updates.
