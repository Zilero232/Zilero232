import type { CommitNode, GitHubUser } from '../github.types';

export type Headline = {
  type: string;
  rest: string;
};

export type CommitLine = Headline & {
  repo: string;
  hash: string;
  age: string;
};

export type RecentCommitsInput = {
  user: GitHubUser;
  now?: number;
};

export type IsOwnWorkInput = {
  commit: CommitNode;
  login: string;
};
