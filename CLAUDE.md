# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

An AWS CDK construct library (`aws-cdk-lib` v2) published via jsii to npm, PyPI, Maven, and Go. Each construct in `src/` is a self-contained CDK L3 construct. Projen manages all project configuration — never hand-edit generated files like `package.json`, `tsconfig.json`, or `.eslintrc.json`; edit `.projenrc.ts` and run `npx projen`.

## Build Commands

```bash
npm run build                # Full pipeline: bundle → compile → lint → test
npm run compile              # TypeScript only
npm run eslint               # Lint (add -- --fix to auto-fix)
npm run test                 # Jest with coverage
npm run test:watch           # Jest watch mode
npx jest test/url-shortener/url-shortener.test.ts              # Single test file
npx jest test/url-shortener/url-shortener.test.ts -t "name"    # Single test by name
npm run bundle               # esbuild all Lambda handlers → assets/
npm run integ:snapshot-all   # Regenerate all integration test snapshots
npm run integ:<name>:snapshot  # Single integration test snapshot (e.g. integ:url-shortener:snapshot)
npx projen                   # Regenerate project files from .projenrc.ts
```

## Architecture

**Construct file layout** — each construct directory under `src/` follows the same pattern:
- `index.ts` — construct class, props interface, and public API (this is the exported module)
- `*.lambda.ts` — Lambda handler source code (bundled by esbuild into `assets/<construct>/<name>.lambda/`)
- `*-function.ts` — projen-generated `lambda.Function` subclass that points to the bundled asset; do not hand-edit these

Lambda handler changes require `npm run bundle` to take effect (bundles are committed to git under `assets/`).

**Tests** mirror `src/` under `test/`:
- `<construct>.test.ts` — unit tests using `Template.fromStack(stack).toJSON()` → `toMatchSnapshot()`
- `<handler>.test.ts` — handler unit tests using `aws-sdk-client-mock` + `nock` for HTTP mocking
- `<construct>.integ.ts` — integration test stacks (snapshots in `<construct>.integ.snapshot/`)

Update CDK snapshots with `npm run test -- -u`. Integration snapshots with `npm run integ:<name>:snapshot`.

**Exports**: `src/index.ts` re-exports all constructs. Each construct is also importable as a subpath (`cloudstructs/lib/<construct>`).

## Key Conventions

- All constructs extend `Construct` from `constructs`, not `cdk.Construct`
- Props interfaces use `readonly` fields with JSDoc (including `@default`)
- Grant methods follow CDK's `iam.Grant.addToPrincipal` pattern
- Runtime deps that Lambda needs (`@slack/web-api`, `got`, `@aws/durable-execution-sdk-js`) are bundledDependencies
- AWS SDK clients are devDependencies only (Lambda runtime provides them)
- Default branch is `master`; commits follow conventional commits (`feat:`, `fix:`, `chore:`)
- Lambda runtime is Node.js 24.x (configured in `.projenrc.ts` `lambdaOptions`)
