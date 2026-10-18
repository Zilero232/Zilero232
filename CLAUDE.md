# Zilero232 profile

Generator for the GitHub profile README. `profile.yml` holds the content, `templates/` the layout, `src/` the code.
`README.md` and `assets/*.svg` are build output: never edit them by hand.

## Commands

- `bun run fetch` saves GitHub data to `data/github.json` (token: `GH_TOKEN`, else `gh auth token`)
- `bun run build` renders `README.md` and `assets/*.svg`
- `bun run verify` typecheck + lint + format check; `bun run fix` applies lint and format fixes
- `bun run test` runs Vitest (never `bun test`); `bun run test -u` refreshes golden SVGs after an intended change

## Code

- One folder per unit, kebab-case: `x.ts`, `x.types.ts`, `x.constants.ts`, `x.schema.ts`, `index.ts`, `_tests/`
- `type`, never `interface`; no `as` casts; named arrow exports; two or more params become one `<Fn>Input` object
- GitHub data types come from `src/github/query.graphql` via graphql-codegen (`postinstall`); change the query, not the types
- `compile()` is pure: data in, files out. IO lives only in `src/build.ts` and `src/fetch.ts`

## Tests

- Pure logic only, in `_tests/` next to the code, `describe(fn)` + `it('reads like a sentence')`
- Cards are tested through the DOM (`data-testid` in templates) plus golden files in `src/compile/_tests/__golden__/`
- Assert relationships (row count matches the profile) over literal copy
- Palette colors must keep WCAG contrast: 4.5 for text, 3 for muted (`profile-file.test.ts`)

## Content and commits

- Code, comments, profile text and commits in English; Conventional Commits (`feat(cards): ...`), enforced by commitlint
- Don't commit or push unless asked
