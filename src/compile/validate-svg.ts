import { XMLValidator } from 'fast-xml-parser';

export const validateSvg = ({ path, content }: { path: string; content: string }) => {
  const result = XMLValidator.validate(content);

  if (result !== true) {
    throw new Error(`${path} is not valid XML: ${result.err.msg} (line ${result.err.line})`);
  }
};
