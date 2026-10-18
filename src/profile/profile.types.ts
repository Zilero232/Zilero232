import type { z } from 'zod';

import type { paletteSchema, profileSchema } from './profile.schema';

export type Palette = z.infer<typeof paletteSchema>;

export type Profile = z.infer<typeof profileSchema>;
