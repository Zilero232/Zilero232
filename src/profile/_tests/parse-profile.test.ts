import { describe, expect, it } from 'vitest';

import { PROFILE } from '../../_tests/fixtures';
import { parseProfile } from '../parse-profile';

describe('parseProfile', () => {
  it('accepts a complete profile', () => {
    expect(parseProfile(PROFILE)).toEqual(PROFILE);
  });

  it('rejects a palette color that is not #rrggbb', () => {
    const profile = { ...PROFILE, theme: { ...PROFILE.theme, dark: { ...PROFILE.theme.dark, bg: 'red' } } };

    expect(() => parseProfile(profile)).toThrow(/theme\.dark\.bg/);
  });

  it('rejects a link without a valid url', () => {
    expect(() => parseProfile({ ...PROFILE, links: [{ label: 'x', url: 'nope' }] })).toThrow(/links/);
  });

  it('names the file in the error', () => {
    expect(() => parseProfile({})).toThrow(/Invalid profile\.yml/);
  });
});
