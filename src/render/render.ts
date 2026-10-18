import nunjucks from 'nunjucks';

import { PATHS } from '../constants';

type RenderInput = {
  template: string;
  context: object;
};

const createEnvironment = (autoescape: boolean) =>
  new nunjucks.Environment(new nunjucks.FileSystemLoader(PATHS.templates), {
    autoescape,
    trimBlocks: true,
    lstripBlocks: true
  });

const svgEnvironment = createEnvironment(true);
const markdownEnvironment = createEnvironment(false);

export const renderSvg = ({ template, context }: RenderInput) => svgEnvironment.render(template, context);

export const renderMarkdown = ({ template, context }: RenderInput) => markdownEnvironment.render(template, context);
