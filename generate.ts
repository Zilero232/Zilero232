/**
 * Renders README.md and assets/header-*.svg from profile.yml and templates/.
 * GitHub numbers come from data/github.json (`bun run fetch`); without it those parts are skipped.
 */
import type { User } from "@octokit/graphql-schema";
import nunjucks from "nunjucks";

const TOP_LANGUAGES = 4;

const profile = Bun.YAML.parse(await Bun.file("profile.yml").text()) as Record<string, any>;
const githubFile = Bun.file("data/github.json");
const github = (await githubFile.exists()) ? summarize((await githubFile.json()).data.user) : null;

function summarize(user: User) {
  const repos = (user.repositories.nodes ?? []).filter((repo) => repo != null);
  const edges = repos.flatMap((repo) => repo.languages?.edges ?? []).filter((edge) => edge != null);
  const bytes = new Map<string, number>();

  for (const { size, node } of edges) {
    bytes.set(node.name, (bytes.get(node.name) ?? 0) + size);
  }

  const totalBytes = [...bytes.values()].reduce((sum, size) => sum + size, 0);
  const languages = [...bytes]
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOP_LANGUAGES)
    .map(([name, size]) => `${name} ${Math.round((size / totalBytes) * 100)}%`);

  return {
    since: new Date(user.createdAt).getFullYear(),
    repos: user.repositories.totalCount,
    stars: repos.reduce((sum, repo) => sum + repo.stargazerCount, 0),
    languages: languages.join(" · "),
  };
}

const environment = (autoescape: boolean) =>
  new nunjucks.Environment(new nunjucks.FileSystemLoader("templates"), {
    autoescape,
    trimBlocks: true,
    lstripBlocks: true,
  });

const context = { ...profile, github };
const svg = environment(true);

for (const [theme, palette] of Object.entries(profile.theme)) {
  await Bun.write(`assets/header-${theme}.svg`, svg.render("header.svg.njk", { ...context, palette }));
}

await Bun.write("README.md", environment(false).render("README.md.njk", context));
