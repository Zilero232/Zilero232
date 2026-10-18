import stringWidth from 'string-width';

const ELLIPSIS = '…';

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

type TruncateInput = {
  text: string;
  cells: number;
};

export const truncate = ({ text, cells }: TruncateInput) => {
  if (stringWidth(text) <= cells) {
    return text;
  }

  let result = '';

  for (const { segment } of segmenter.segment(text)) {
    if (stringWidth(result + segment) > cells - stringWidth(ELLIPSIS)) {
      break;
    }

    result += segment;
  }

  return `${result.trimEnd()}${ELLIPSIS}`;
};
