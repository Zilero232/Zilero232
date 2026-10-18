import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

import { PATHS } from '../constants';
import { parseProfile } from './parse-profile';

export const loadProfile = async (path: string = PATHS.profile) => parseProfile(parse(await readFile(path, 'utf8')));
