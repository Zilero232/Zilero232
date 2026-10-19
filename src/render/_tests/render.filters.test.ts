import { describe, expect, it } from 'vitest';

import { hex, shieldsLabel } from '../render.filters';

describe('shieldsLabel', () => {
  it('turns spaces into underscores', () => {
    expect(shieldsLabel('Habr Career')).toBe('Habr_Career');
  });

  it('doubles dashes and underscores so shields does not read them as separators', () => {
    expect(shieldsLabel('dev-config_hub')).toBe('dev--config__hub');
  });

  it('encodes characters that are not safe in a url path', () => {
    expect(shieldsLabel('C# / .NET')).toBe('C%23_%2F_.NET');
  });
});

describe('hex', () => {
  it('drops the leading hash', () => {
    expect(hex('#1F1F28')).toBe('1F1F28');
  });

  it('leaves a bare value alone', () => {
    expect(hex('1F1F28')).toBe('1F1F28');
  });
});
