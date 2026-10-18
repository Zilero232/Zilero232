import { describe, expect, it } from 'vitest';

import { USER } from '../../../_tests/fixtures';
import { stats, topLanguages } from '../stats';
import { TOP_LANGUAGES } from '../stats.constants';

describe('topLanguages', () => {
  it('ranks languages by bytes summed across repos', () => {
    expect(topLanguages(USER).map((line) => line.split(' ')[0])).toEqual(['TypeScript', 'Shell', 'CSS']);
  });

  it('gives each language its share of all bytes', () => {
    expect(topLanguages(USER)).toEqual(['TypeScript 60%', 'Shell 30%', 'CSS 10%']);
  });

  it('keeps only the top languages', () => {
    const edges = Array.from({ length: TOP_LANGUAGES + 2 }, (_, index) => ({ size: 10, node: { name: `L${index}` } }));
    const user = {
      ...USER,
      repositories: { totalCount: 1, nodes: [{ name: 'x', stargazerCount: 0, languages: { edges } }] }
    };

    expect(topLanguages(user)).toHaveLength(TOP_LANGUAGES);
  });
});

describe('stats', () => {
  it('sums stars over public repos and reads the join year', () => {
    expect(stats(USER)).toMatchObject({ since: 2020, repos: 3, stars: 15 });
  });

  it('joins the languages into one line', () => {
    expect(stats(USER).languages).toBe(topLanguages(USER).join(' · '));
  });
});
