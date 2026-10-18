import { countBy } from 'remeda';
import { describe, expect, it } from 'vitest';

import type { GitHubUser } from '../../github.types';

import { commit, NOW, repo, USER } from '../../../_tests/fixtures';
import { COMMITS } from '../commits.constants';
import { recentCommits } from '../recent-commits';

const withRecent = (nodes: GitHubUser['recent']['nodes']): GitHubUser => ({ ...USER, recent: { nodes } });

const DAY = '2026-10-18T10:00:00Z';

describe('recentCommits', () => {
  it('lists commits newest first across repos', () => {
    const hashes = recentCommits({ user: USER, now: NOW }).map(({ hash }) => hash);

    expect(hashes).toEqual(['aaa0001', 'bbb0001', 'aaa0002']);
  });

  it('carries the repo, the age and the parsed headline', () => {
    const [first] = recentCommits({ user: USER, now: NOW });

    expect(first).toMatchObject({ repo: 'app', age: 'yesterday', type: 'feat', rest: '(api): add login' });
  });

  it('skips commits by other authors and bots', () => {
    const user = withRecent([
      repo({
        name: 'app',
        commits: [
          commit({ headline: 'chore(deps): bump', date: DAY, login: 'renovate[bot]' }),
          commit({ headline: 'Update README', date: DAY, login: null })
        ]
      })
    ]);

    expect(recentCommits({ user, now: NOW })).toEqual([]);
  });

  it('skips merge commits', () => {
    const user = withRecent([
      repo({ name: 'app', commits: [commit({ headline: 'Merge pull request #1 from octocat/feat', date: DAY })] })
    ]);

    expect(recentCommits({ user, now: NOW })).toEqual([]);
  });

  it('skips the profile repo itself', () => {
    const user = withRecent([repo({ name: USER.login, commits: [commit({ headline: 'feat: card', date: DAY })] })]);

    expect(recentCommits({ user, now: NOW })).toEqual([]);
  });

  it('skips repos whose branch does not point at a commit', () => {
    const user = withRecent([{ name: 'app', defaultBranchRef: { target: { __typename: 'Tree' } } }, null]);

    expect(recentCommits({ user, now: NOW })).toEqual([]);
  });

  it('takes a limited number per repo and in total', () => {
    const many = Array.from({ length: 5 }, (_, index) =>
      repo({
        name: `repo-${index}`,
        commits: Array.from({ length: 5 }, () => commit({ headline: 'feat: x', date: DAY }))
      })
    );

    const lines = recentCommits({ user: withRecent(many), now: NOW });
    const perRepo = Math.max(...Object.values(countBy(lines, (line) => line.repo)));

    expect(lines).toHaveLength(COMMITS.total);
    expect(perRepo).toBeLessThanOrEqual(COMMITS.perRepo);
  });
});
