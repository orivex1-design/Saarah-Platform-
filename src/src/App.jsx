23:29:00.855 Running build in Washington, D.C., USA (East) – iad1
23:29:00.859 Build machine configuration: 2 cores, 8 GB
23:29:00.877 Cloning github.com/orivex1-design/Saarah-Platform- (Branch: main, Commit: 0e4d9f7)
23:29:00.878 Skipping build cache, deployment was triggered without cache.
23:29:01.220 Cloning completed: 343.000ms
23:29:01.628 Running "vercel build"
23:29:01.652 Vercel CLI 53.3.2
23:29:02.406 Installing dependencies...
23:29:12.936 
23:29:12.936 added 71 packages in 10s
23:29:12.937 
23:29:12.937 7 packages are looking for funding
23:29:12.937   run `npm fund` for details
23:29:12.977 Running "npm run build"
23:29:13.071 
23:29:13.072 > saarah-platform@0.1.0 build
23:29:13.072 > vite build
23:29:13.072 
23:29:13.258 vite v5.4.21 building for production...
23:29:13.304 transforming...
23:29:13.326 ✓ 3 modules transformed.
23:29:13.327 x Build failed in 47ms
23:29:13.328 error during build:
23:29:13.328 Could not resolve "./App.jsx" from "src/main.jsx"
23:29:13.328 file: /vercel/path0/src/main.jsx
23:29:13.329     at getRollupError (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:406:41)
23:29:13.329     at error (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:402:42)
23:29:13.329     at ModuleLoader.handleInvalidResolvedId (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:22127:24)
23:29:13.330     at file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:22087:26
23:29:13.345 Error: Command "npm run build" exited with 1
