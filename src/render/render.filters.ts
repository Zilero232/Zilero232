export const shieldsLabel = (label: string) =>
  encodeURIComponent(label.replaceAll('-', '--').replaceAll('_', '__').replaceAll(' ', '_'));

export const hex = (color: string) => color.replace(/^#/, '');
