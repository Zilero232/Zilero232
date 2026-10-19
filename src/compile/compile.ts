import type { CompileInput, Output } from './compile.types';

import { assetPath, CARD, CARDS, PATHS } from '../constants';
import { recentCommits, stats } from '../github';
import { renderMarkdown, renderSvg } from '../render';
import { validateSvg } from './validate-svg';

const githubContext = ({ data, now }: Pick<CompileInput, 'data' | 'now'>) => {
  if (!data?.user) {
    return null;
  }

  return { ...stats(data.user), commits: recentCommits({ user: data.user, now }) };
};

export const compile = ({ profile, data, now, fonts }: CompileInput): Output[] => {
  const context = {
    ...profile,
    github: githubContext({ data, now }),
    fonts,
    card: CARD
  };

  const cards = CARDS.flatMap((card) =>
    Object.entries(profile.theme).map(([theme, palette]) => ({
      path: assetPath(card, theme),
      content: renderSvg({ template: `${card}.svg.njk`, context: { ...context, palette } })
    }))
  );

  cards.forEach(validateSvg);

  return [...cards, { path: PATHS.readme, content: renderMarkdown({ template: 'README.md.njk', context }) }];
};
