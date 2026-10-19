export const PATHS = {
  profile: 'profile.yml',
  templates: 'templates',
  query: 'src/github/query.graphql',
  data: 'data/github.json',
  readme: 'README.md'
} as const;

export const CARDS = ['header', 'activity'] as const;

export const CARD = { width: 920, line: 18 } as const;

export const assetPath = (card: string, theme: string) => `assets/${card}-${theme}.svg`;
