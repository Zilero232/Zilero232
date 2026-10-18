import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import type { CompileInput } from '../compile.types';

import { commit, NOW, PROFILE, repo, USER } from '../../_tests/fixtures';
import { CARDS, PATHS } from '../../constants';
import { compile } from '../compile';
import { validateSvg } from '../validate-svg';

const INPUT: CompileInput = { profile: PROFILE, data: { user: USER }, now: NOW, fonts: null };

const GITHUB_ROWS = 3;

const content = (outputs: ReturnType<typeof compile>, path: string) => {
  const output = outputs.find((item) => item.path === path);

  if (!output) {
    throw new Error(`${path} was not compiled`);
  }

  return output.content;
};

const svg = (path: string, input: CompileInput = INPUT) =>
  new JSDOM(content(compile(input), path), { contentType: 'image/svg+xml' }).window.document;

const byTestId = (document: Document, id: string) => [...document.querySelectorAll(`[data-testid="${id}"]`)];

const texts = (document: Document, id: string) => byTestId(document, id).map((node) => node.textContent);

describe('compile', () => {
  it('renders every card in every theme and the README', () => {
    const paths = compile(INPUT).map(({ path }) => path);
    const themes = Object.keys(PROFILE.theme);

    expect(paths).toHaveLength(CARDS.length * themes.length + 1);
    expect(paths).toContain(PATHS.readme);
  });

  it('gives the same output for the same input', () => {
    expect(compile(INPUT)).toEqual(compile(INPUT));
  });

  it.each(CARDS.flatMap((card) => Object.keys(PROFILE.theme).map((theme) => `assets/${card}-${theme}.svg`)))(
    '%s matches its golden file',
    async (path) => {
      await expect(content(compile(INPUT), path)).toMatchFileSnapshot(`./__golden__/${path.split('/').at(-1)}`);
    }
  );

  it('prefixes ids with the card name so cards can share a page', () => {
    const ids = CARDS.flatMap((card) =>
      [...svg(`assets/${card}-dark.svg`).querySelectorAll('[id]')].map((node) => node.id)
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('embeds the fonts only when they are given', () => {
    const withFonts = {
      ...INPUT,
      fonts: { regular: 'data:font/woff2;base64,AAAA', bold: 'data:font/woff2;base64,BBBB' }
    };

    expect(content(compile(withFonts), 'assets/header-dark.svg')).toContain('@font-face');
    expect(content(compile(INPUT), 'assets/header-dark.svg')).not.toContain('@font-face');
  });
});

describe('header card', () => {
  it('shows a row per profile row followed by the GitHub rows', () => {
    const keys = texts(svg('assets/header-dark.svg'), 'key');

    expect(keys).toHaveLength(PROFILE.header.rows.length + GITHUB_ROWS);
    expect(keys.slice(0, PROFILE.header.rows.length)).toEqual(PROFILE.header.rows.map(([key]) => key));
  });

  it('leaves the GitHub rows out without data', () => {
    expect(texts(svg('assets/header-dark.svg', { ...INPUT, data: null }), 'key')).toHaveLength(
      PROFILE.header.rows.length
    );
  });

  it('draws every logo line and every swatch', () => {
    const document = svg('assets/header-dark.svg');

    expect(byTestId(document, 'logo-line')).toHaveLength(PROFILE.header.logo.length);
    expect(byTestId(document, 'swatch')).toHaveLength(PROFILE.theme.dark.swatches.length);
  });

  it('describes its rows for screen readers', () => {
    const description = svg('assets/header-dark.svg').querySelector('desc')?.textContent ?? '';

    PROFILE.header.rows.forEach(([key, value]) => expect(description).toContain(`${key}: ${value}`));
  });
});

describe('activity card', () => {
  it('shows one entry per recent commit with its repo', () => {
    expect(texts(svg('assets/activity-dark.svg'), 'repo')).toEqual(['app', 'dotfiles', 'app']);
  });

  it('colors the commit type with its swatch', () => {
    const type = byTestId(svg('assets/activity-dark.svg'), 'type')[0];

    expect(type?.textContent).toBe('feat');
    expect(type?.getAttribute('fill')).toBe(PROFILE.theme.dark.swatches[3]);
  });

  it('keeps markup in a commit message as text', () => {
    const headline = 'feat: <script>alert(1)</script> & "quotes"';
    const data = {
      user: {
        ...USER,
        recent: { nodes: [repo({ name: 'app', commits: [commit({ headline, date: '2026-10-18T10:00:00Z' })] })] }
      }
    };

    const document = svg('assets/activity-dark.svg', { ...INPUT, data });

    expect(document.querySelector('script')).toBeNull();
    expect(texts(document, 'subject')[0]).toContain('<script>alert(1)</script> & "quotes"');
  });
});

describe('stack card', () => {
  it('lists each area with its tools', () => {
    const document = svg('assets/stack-dark.svg');

    expect(texts(document, 'name')).toEqual(Object.keys(PROFILE.stack));
    expect(texts(document, 'tools')).toEqual(Object.values(PROFILE.stack).map((tools) => tools.join(' · ')));
  });

  it('closes the tree on the last area only', () => {
    const branches = texts(svg('assets/stack-dark.svg'), 'branch');

    expect(branches.at(-1)).toBe('`-- ');
    expect(branches.slice(0, -1).every((branch) => branch === '|-- ')).toBe(true);
  });

  it('counts areas and tools like tree does', () => {
    const tools = Object.values(PROFILE.stack).flat().length;

    expect(texts(svg('assets/stack-dark.svg'), 'summary')[0]).toBe(
      `${Object.keys(PROFILE.stack).length} directories, ${tools} files`
    );
  });
});

describe('README', () => {
  it('switches every card between themes with a picture element', () => {
    const readme = content(compile(INPUT), PATHS.readme);

    CARDS.forEach((card) => {
      expect(readme).toContain(`./assets/${card}-dark.svg`);
      expect(readme).toContain(`./assets/${card}-light.svg`);
    });
  });

  it('links every profile link', () => {
    const readme = content(compile(INPUT), PATHS.readme);

    PROFILE.links.forEach(({ url }) => expect(readme).toContain(`href="${url}"`));
  });

  it('drops the activity card without GitHub data', () => {
    expect(content(compile({ ...INPUT, data: null }), PATHS.readme)).not.toContain('activity-dark.svg');
  });
});

describe('validateSvg', () => {
  it('rejects malformed markup and names the file', () => {
    expect(() => validateSvg({ path: 'assets/x.svg', content: '<svg><text></svg>' })).toThrow(/assets\/x\.svg/);
  });
});
