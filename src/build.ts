import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { ProfileData } from './github';

import { compile } from './compile';
import { PATHS } from './constants';
import { loadFonts } from './fonts';
import { loadProfile } from './profile';

const loadData = async (): Promise<ProfileData | null> => {
  try {
    return JSON.parse(await readFile(PATHS.data, 'utf8'));
  } catch {
    console.warn(`${PATHS.data} not found, building without GitHub data (run \`bun run fetch\`)`);

    return null;
  }
};

const outputs = compile({
  profile: await loadProfile(),
  data: await loadData(),
  now: Date.now(),
  fonts: await loadFonts()
});

for (const { path, content } of outputs) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

console.log(`Rendered ${outputs.map(({ path }) => path).join(', ')}`);
