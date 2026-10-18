import { map, pipe, sortBy, take } from 'remeda';

import type { CommitLine, IsOwnWorkInput, RecentCommitsInput } from './commits.types';

import { timeAgo } from '../../lib/time-ago';
import { COMMITS } from './commits.constants';
import { parseHeadline } from './parse-headline';

const isOwnWork = ({ commit, login }: IsOwnWorkInput) =>
  commit.author?.user?.login === login && !commit.messageHeadline.startsWith('Merge ');

const ownCommits = ({ user }: RecentCommitsInput) =>
  (user.recent.nodes ?? [])
    .filter((repo) => repo != null)
    .filter((repo) => repo.name !== user.login)
    .flatMap((repo) => {
      const target = repo.defaultBranchRef?.target;

      if (target?.__typename !== 'Commit') {
        return [];
      }

      return (target.history.nodes ?? [])
        .filter((commit) => commit != null)
        .filter((commit) => isOwnWork({ commit, login: user.login }))
        .slice(0, COMMITS.perRepo)
        .map((commit) => ({ repo: repo.name, commit }));
    });

export const recentCommits = ({ user, now = Date.now() }: RecentCommitsInput): CommitLine[] =>
  pipe(
    ownCommits({ user }),
    sortBy([({ commit }) => commit.committedDate, 'desc']),
    take(COMMITS.total),
    map(({ repo, commit }) => ({
      repo,
      hash: commit.abbreviatedOid,
      age: timeAgo({ date: commit.committedDate, now }),
      ...parseHeadline(commit.messageHeadline)
    }))
  );
