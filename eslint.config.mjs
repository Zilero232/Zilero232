import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    ignores: [
      '**/node_modules',
      'src/github/generated/**',
      'assets/**',
      'data/**',
      'README.md',
      'templates/**',
      'coverage/**'
    ]
  },

  // The shared config applies these to every language it parses, and they throw
  // on JSON/YAML ("rules do not support the language jsonc/x").
  {
    name: 'profile/data-files',
    files: ['**/*.json', '**/*.jsonc', '**/*.yaml', '**/*.yml'],
    rules: {
      'arrow-body-style': 'off',
      'import/newline-after-import': 'off',
      'no-console': 'off',
      'prefer-template': 'off',
      'unicorn/no-typeof-undefined': 'off',
      'unicorn/no-useless-spread': 'off'
    }
  },

  {
    name: 'profile/typescript',
    files: ['**/*.?([cm])[jt]s?(x)'],
    rules: {
      'ts/consistent-type-definitions': ['error', 'type'],
      'ts/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      'node/prefer-global/process': 'off',
      // build.ts and fetch.ts are ESM entrypoints Bun runs directly.
      'antfu/no-top-level-await': 'off',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['return', 'throw', 'continue', 'break'] },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        {
          blankLine: 'always',
          prev: '*',
          next: ['if', 'for', 'while', 'do', 'switch', 'try', 'function', 'class', 'export']
        },
        {
          blankLine: 'always',
          prev: ['if', 'for', 'while', 'do', 'switch', 'try', 'function', 'class', 'block-like'],
          next: '*'
        },
        { blankLine: 'always', prev: 'multiline-expression', next: '*' },
        { blankLine: 'always', prev: '*', next: 'multiline-expression' },
        { blankLine: 'always', prev: 'multiline-const', next: '*' },
        { blankLine: 'any', prev: 'export', next: 'export' }
      ]
    }
  },

  {
    name: 'profile/manifests',
    files: ['**/package.json', '**/tsconfig*.json'],
    rules: {
      'jsonc/sort-keys': 'off'
    }
  },

  // Console is the output channel of the build and fetch scripts.
  {
    name: 'profile/entrypoints',
    files: ['src/build.ts', 'src/fetch.ts'],
    rules: {
      'no-console': 'off'
    }
  }
);
