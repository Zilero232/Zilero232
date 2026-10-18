import type { ProfileDataQuery } from './generated/query.types';

export type ProfileData = ProfileDataQuery;

export type GitHubUser = NonNullable<ProfileDataQuery['user']>;

type RecentRepo = NonNullable<NonNullable<GitHubUser['recent']['nodes']>[number]>;

type BranchTarget = NonNullable<NonNullable<RecentRepo['defaultBranchRef']>['target']>;

export type CommitNode = NonNullable<
  NonNullable<Extract<BranchTarget, { __typename: 'Commit' }>['history']['nodes']>[number]
>;
