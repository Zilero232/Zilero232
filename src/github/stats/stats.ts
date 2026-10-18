import { entries, groupBy, map, mapValues, pipe, sortBy, sumBy, take } from 'remeda';

import type { GitHubUser } from '../github.types';
import type { Stats } from './stats.types';

import { TOP_LANGUAGES } from './stats.constants';

const percent = (part: number, total: number) => Math.round((part / total) * 100);

export const topLanguages = (user: GitHubUser) => {
  const edges = (user.repositories.nodes ?? [])
    .flatMap((repo) => repo?.languages?.edges ?? [])
    .filter((edge) => edge != null);

  const total = sumBy(edges, (edge) => edge.size);

  return pipe(
    edges,
    groupBy((edge) => edge.node.name),
    mapValues((group) => sumBy(group, (edge) => edge.size)),
    entries(),
    sortBy([([, size]) => size, 'desc']),
    take(TOP_LANGUAGES),
    map(([name, size]) => `${name} ${percent(size, total)}%`)
  );
};

export const stats = (user: GitHubUser): Stats => {
  const repos = (user.repositories.nodes ?? []).filter((repo) => repo != null);

  return {
    since: new Date(user.createdAt).getFullYear(),
    repos: user.repositories.totalCount,
    stars: sumBy(repos, (repo) => repo.stargazerCount),
    languages: topLanguages(user).join(' · ')
  };
};
