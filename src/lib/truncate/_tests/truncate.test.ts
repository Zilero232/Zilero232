import stringWidth from 'string-width';
import { describe, expect, it } from 'vitest';

import { truncate } from '../truncate';

describe('truncate', () => {
  it('keeps text that fits', () => {
    expect(truncate({ text: 'short', cells: 10 })).toBe('short');
  });

  it('cuts text to the given number of cells with an ellipsis', () => {
    const result = truncate({ text: 'a'.repeat(20), cells: 10 });

    expect(stringWidth(result)).toBe(10);
    expect(result.endsWith('…')).toBe(true);
  });

  it('counts wide characters as two cells', () => {
    expect(stringWidth(truncate({ text: '漢字'.repeat(10), cells: 9 }))).toBeLessThanOrEqual(9);
  });

  it('never splits an emoji in half', () => {
    const result = truncate({ text: `${'👩‍💻'.repeat(10)}`, cells: 7 });

    expect([...new Intl.Segmenter().segment(result)].every(({ segment }) => segment === '👩‍💻' || segment === '…')).toBe(
      true
    );
  });

  it('does not leave a space before the ellipsis', () => {
    expect(truncate({ text: 'one two three four', cells: 9 })).toBe('one two…');
  });
});
