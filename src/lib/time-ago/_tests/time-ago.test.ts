import { describe, expect, it } from 'vitest';

import { timeAgo } from '../time-ago';

const NOW = Date.parse('2026-10-19T12:00:00Z');

describe('timeAgo', () => {
  it('says today for a date earlier the same day', () => {
    expect(timeAgo({ date: '2026-10-19T08:00:00Z', now: NOW })).toBe('today');
  });

  it('says yesterday for a date one day back', () => {
    expect(timeAgo({ date: '2026-10-18T12:00:00Z', now: NOW })).toBe('yesterday');
  });

  it('counts days within a month', () => {
    expect(timeAgo({ date: '2026-10-13T12:00:00Z', now: NOW })).toBe('6 days ago');
  });

  it('switches to months after thirty days', () => {
    expect(timeAgo({ date: '2026-08-19T12:00:00Z', now: NOW })).toBe('2 months ago');
  });
});
