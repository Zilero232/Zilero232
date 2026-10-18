import type { Headline } from './commits.types';

import { truncate } from '../../lib/truncate';
import { COMMITS, CONVENTIONAL_TYPE, GITMOJI } from './commits.constants';

export const parseHeadline = (headline: string): Headline => {
  const text = headline.replace(GITMOJI, '');
  const type = CONVENTIONAL_TYPE.exec(text)?.[1] ?? '';

  return { type, rest: truncate({ text: text.slice(type.length), cells: COMMITS.subjectWidth - type.length }) };
};
