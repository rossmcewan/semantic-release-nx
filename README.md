# @rossmcewan/semantic-release-nx

Apply [`semantic-release`'s](https://github.com/semantic-release/semantic-release) automatic publishing to an [Nx](https://nx.dev) monorepo.

## Why
The default configuration of `semantic-release` assumes a one-to-one relationship between a GitHub repository and an `npm` package.

This library allows using `semantic-release` with a single GitHub repository containing many `npm` packages.

## How

Instead of attributing all commits to a single package, commits are assigned to packages based on the files that a commit touched.

If a commit touched a file in or below a package's root, it will be considered for that package's next release. A single commit can belong to multiple packages and may trigger the release of multiple packages.

Additionally, if a commit touches a file of a package that is a dependency of the current package, then the commit will also be included.

In order to avoid version collisions, generated git tags are namespaced using the given package's name: `<package-name>-<version>`.

## Install
Both `semantic-release` and `@rossmcewan/semantic-release-nx` must be accessible in each monorepo package.

```bash
npm install -D semantic-release @rossmcewan/semantic-release-nx
```

## Usage

Run `semantic-release` in an **individual monorepo package** and apply `@rossmcewan/semantic-release-nx` via the [`extends`](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#extends) option.

On the command line:
```bash
$ npm run semantic-release -e @rossmcewan/semantic-release-nx
```

Or in the [release config](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration-file):
```json
{
  "extends": "@rossmcewan/semantic-release-nx"
}
```

NOTE: This library **CAN'T** be applied via the `plugins` option.

```json
{
  "plugins": [
    "@rossmcewan/semantic-release-nx" // This WON'T work
  ]
}
```

### With Yarn Workspaces

```bash
$ yarn workspaces run semantic-release -e @rossmcewan/semantic-release-nx
```

### With pnpm
[pnpm](https://pnpm.io/) has built-in [workspace](https://pnpm.io/workspaces) functionality for monorepos. Similarly to the above, you can use pnpm to make release in all packages:

```bash
pnpm -r --workspace-concurrency=1 exec -- npx --no-install semantic-release -e @rossmcewan/semantic-release-nx
```

 Thanks to how [`npx's package resolution works`](https://github.com/npm/npx#description), if the repository root is in `$PATH` (typically true on CI), `semantic-release` and `@rossmcewan/semantic-release-nx` can be installed once in the repo root instead of in each individual package, likely saving both time and disk space.


## Advanced
This library modifies the `context` object passed to `semantic-release` plugins in the following way to make them compatible with a monorepo.

| Step               | Description                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `analyzeCommits` | Filters `context.commits` to only include the given monorepo package's commits and any commmits that affects packages the current package depends on.                              |
| `generateNotes`          | <ul><li>Filters `context.commits` to only include the given monorepo package's commits.</li><li>Modifies `context.nextRelease.version` to use the [monorepo git tag format](#how). The wrapped (default) `generateNotes` implementation uses this variable as the header for the release notes. Since all release notes end up in the same Github repository, using just the version as a header introduces ambiguity.</li></ul>   |

### tagFormat

Pre-configures the [`tagFormat` option](https://github.com/semantic-release/semantic-release/blob/caribou/docs/usage/configuration.md#tagformat) to use the [monorepo git tag format](#how).