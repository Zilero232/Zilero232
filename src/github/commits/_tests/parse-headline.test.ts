import { describe, expect, it } from 'vitest';

import { COMMITS } from '../commits.constants';
import { parseHeadline } from '../parse-headline';

describe('parseHeadline', () => {
  it('splits the conventional type from the rest', () => {
    expect(parseHeadline('feat(devices): enforce the device limit')).toEqual({
      type: 'feat',
      rest: '(devices): enforce the device limit'
    });
  });

  it('handles a type without a scope and a breaking marker', () => {
    expect(parseHeadline('refactor!: drop the v1 api').type).toBe('refactor');
  });

  it('drops a leading gitmoji', () => {
    expect(parseHeadline('🐛 fix(dotfiles): call scripts by path').type).toBe('fix');
  });

  it('leaves a plain headline without a type', () => {
    expect(parseHeadline('Update README')).toEqual({ type: '', rest: 'Update README' });
  });

  it('does not take a word followed by a colon in prose as a type', () => {
    expect(parseHeadline('Note to self, docs: later').type).toBe('');
  });

  it('cuts a long headline to the card width with an ellipsis', () => {
    const { type, rest } = parseHeadline(`feat: ${'a'.repeat(100)}`);

    expect(type.length + rest.length).toBe(COMMITS.subjectWidth);
    expect(rest.endsWith('…')).toBe(true);
  });
});
