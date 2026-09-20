# Airstream `findUpdate` benchmark

This repository contains the two optimized Scala.js benchmark bundles used to compare the generic and specialized `Vector.findUpdate` implementations.

Run locally with [Bun](https://bun.sh/):

```sh
bun benchmark.ts before.js
bun benchmark.ts after.js
```

Every push and manual workflow run executes the benchmark and publishes the runtime and bundle-size comparison in the GitHub Actions job summary.

The benchmark uses a 256-element `Vector`, matches the first element, warms up for 1,000 updates, and reports the median of 15 measured rounds of 10,000 updates.
