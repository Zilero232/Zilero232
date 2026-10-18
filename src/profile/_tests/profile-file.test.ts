import { colord, extend } from 'colord';
import a11y from 'colord/plugins/a11y';
import { describe, expect, it } from 'vitest';

import { loadProfile } from '../load-profile';

extend([a11y]);

const TEXT_CONTRAST = 4.5;
const SECONDARY_CONTRAST = 3;

const profile = await loadProfile();

describe('profile.yml', () => {
  it('matches the schema', () => {
    expect(profile.username).not.toBe('');
  });

  describe.each(Object.entries(profile.theme))('%s palette', (_, palette) => {
    it.each(['fg', 'key', 'accent', 'prompt'] as const)('%s text is readable on the background', (color) => {
      expect(colord(palette[color]).contrast(palette.bg)).toBeGreaterThanOrEqual(TEXT_CONTRAST);
    });

    it('every swatch used as text is readable on the background', () => {
      palette.swatches.forEach((swatch) => {
        expect(colord(swatch).contrast(palette.bg), swatch).toBeGreaterThanOrEqual(TEXT_CONTRAST);
      });
    });

    it('muted text meets the secondary contrast', () => {
      expect(colord(palette.muted).contrast(palette.bg)).toBeGreaterThanOrEqual(SECONDARY_CONTRAST);
    });
  });
});
