import type { Fonts } from '../fonts';
import type { ProfileData } from '../github';
import type { Profile } from '../profile';

export type CompileInput = {
  profile: Profile;
  data: ProfileData | null;
  now: number;
  fonts: Fonts | null;
};

export type Output = {
  path: string;
  content: string;
};
