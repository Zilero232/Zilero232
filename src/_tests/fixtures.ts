import type { CommitNode, GitHubUser } from '../github';
import type { Palette, Profile } from '../profile';

export const NOW = Date.parse('2026-10-19T12:00:00Z');

const PALETTE: Palette = {
  bg: '#1F1F28',
  bar: '#16161D',
  border: '#2A2A37',
  fg: '#DCD7BA',
  muted: '#727169',
  key: '#7E9CD8',
  accent: '#FFA066',
  prompt: '#98BB6C',
  logo: ['#7E9CD8', '#957FB8'],
  swatches: ['#E46876', '#FFA066', '#E6C384', '#98BB6C', '#7AA89F', '#7E9CD8', '#957FB8', '#D27E99']
};

export const PROFILE: Profile = {
  username: 'octocat',
  name: 'Octo Cat',
  tagline: 'Writes TypeScript · web and desktop',
  links: [
    { label: 'Blog', url: 'https://example.com' },
    { label: 'Email Me', url: 'mailto:octo@example.com', logo: 'gmail', color: '#EA4335' }
  ],
  intro: 'Writes TypeScript.',
  header: {
    user: 'octo',
    host: 'arch',
    rows: [
      ['OS', 'Arch Linux'],
      ['Shell', 'fish']
    ],
    logo: ['  /\\', ' /  \\', '/____\\']
  },
  stack: {
    Frontend: ['react', 'vue'],
    Backend: ['nodejs']
  },
  theme: { dark: PALETTE, light: { ...PALETTE, bg: '#F2ECBC', fg: '#545464' } }
};

type CommitInput = {
  headline: string;
  date: string;
  login?: string | null;
  hash?: string;
};

export const commit = ({ headline, date, login = 'octocat', hash = 'abc1234' }: CommitInput): CommitNode => ({
  abbreviatedOid: hash,
  messageHeadline: headline,
  committedDate: date,
  author: { user: login === null ? null : { login } }
});

type RepoInput = {
  name: string;
  commits: CommitNode[];
};

export const repo = ({ name, commits }: RepoInput) => ({
  name,
  defaultBranchRef: { target: { __typename: 'Commit' as const, history: { nodes: commits } } }
});

export const USER: GitHubUser = {
  login: 'octocat',
  createdAt: '2020-07-15T17:06:55Z',
  repositories: {
    totalCount: 3,
    nodes: [
      {
        name: 'app',
        stargazerCount: 10,
        languages: {
          edges: [
            { size: 600, node: { name: 'TypeScript' } },
            { size: 100, node: { name: 'CSS' } }
          ]
        }
      },
      {
        name: 'dotfiles',
        stargazerCount: 5,
        languages: { edges: [{ size: 300, node: { name: 'Shell' } }] }
      },
      { name: 'empty', stargazerCount: 0, languages: null }
    ]
  },
  recent: {
    nodes: [
      repo({
        name: 'app',
        commits: [
          commit({ headline: 'feat(api): add login', date: '2026-10-18T10:00:00Z', hash: 'aaa0001' }),
          commit({ headline: 'fix: typo', date: '2026-10-10T10:00:00Z', hash: 'aaa0002' })
        ]
      }),
      repo({
        name: 'dotfiles',
        commits: [commit({ headline: '✨ feat(waybar): add clock', date: '2026-10-17T10:00:00Z', hash: 'bbb0001' })]
      })
    ]
  }
};
