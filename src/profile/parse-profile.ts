import { z } from 'zod';

import type { Profile } from './profile.types';

import { profileSchema } from './profile.schema';

export const parseProfile = (data: unknown): Profile => {
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid profile.yml:\n${z.prettifyError(result.error)}`);
  }

  return result.data;
};
