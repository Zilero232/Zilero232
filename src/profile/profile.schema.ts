import { z } from 'zod';

const hexColor = z.string().regex(/^#[\da-f]{6}$/i, 'expected a #rrggbb color');

export const paletteSchema = z.object({
  bg: hexColor,
  bar: hexColor,
  border: hexColor,
  fg: hexColor,
  muted: hexColor,
  key: hexColor,
  accent: hexColor,
  prompt: hexColor,
  logo: z.tuple([hexColor, hexColor]),
  swatches: z.array(hexColor).min(4)
});

export const profileSchema = z.object({
  username: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  links: z
    .array(
      z.object({ label: z.string().min(1), url: z.url(), logo: z.string().optional(), color: hexColor.optional() })
    )
    .min(1),
  intro: z.string().min(1),
  header: z.object({
    user: z.string().min(1),
    host: z.string().min(1),
    rows: z.array(z.tuple([z.string().min(1), z.string().min(1)])).min(1),
    logo: z.array(z.string()).min(1)
  }),
  stack: z.record(z.string(), z.array(z.string().min(1)).min(1)),
  theme: z.object({ dark: paletteSchema, light: paletteSchema })
});
