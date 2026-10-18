import { graphql } from '@octokit/graphql';
import { $ } from 'bun';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { ProfileData } from './github';

import { PATHS } from './constants';
import { loadProfile } from './profile';

const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? (await $`gh auth token`.text()).trim();
const { username } = await loadProfile();

const data = await graphql<ProfileData>(await readFile(PATHS.query, 'utf8'), {
  login: username,
  headers: { authorization: `token ${token}` }
});

await mkdir(dirname(PATHS.data), { recursive: true });
await writeFile(PATHS.data, JSON.stringify(data, null, 2));

console.log(`Saved GitHub data for ${username} to ${PATHS.data}`);
