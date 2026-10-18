const DAY_MS = 86_400_000;
const DAYS_IN_MONTH = 30;

const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

type TimeAgoInput = {
  date: string;
  now: number;
};

export const timeAgo = ({ date, now }: TimeAgoInput) => {
  const days = Math.round((Date.parse(date) - now) / DAY_MS);

  if (Math.abs(days) < DAYS_IN_MONTH) {
    return formatter.format(days, 'day');
  }

  return formatter.format(Math.round(days / DAYS_IN_MONTH), 'month');
};
