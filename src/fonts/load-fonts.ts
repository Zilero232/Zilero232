import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

import type { Fonts } from './fonts.types';

const require = createRequire(import.meta.url);

const FILES = {
  regular: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2',
  bold: '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2'
} as const;

const toDataUri = async (file: string) =>
  `data:font/woff2;base64,${(await readFile(require.resolve(file))).toString('base64')}`;

export const loadFonts = async (): Promise<Fonts> => ({
  regular: await toDataUri(FILES.regular),
  bold: await toDataUri(FILES.bold)
});
