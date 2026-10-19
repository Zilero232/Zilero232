export const COMMITS = {
  total: 8,
  perRepo: 2,
  repoWidth: 16,
  subjectWidth: 58
} as const;

export const GITMOJI = /^\p{Extended_Pictographic}️?\s*/u;

export const CONVENTIONAL_TYPE = /^(\w+)(?=(?:\([^)]*\))?!?:)/;
