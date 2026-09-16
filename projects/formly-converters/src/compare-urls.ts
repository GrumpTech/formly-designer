const collator = new Intl.Collator('en-US', {
  caseFirst: 'lower',
  numeric: true,
});

export function compareUrls(x: string, y: string) {
  x = x.replace(/[\*\:{]/g, 'Ω');
  y = y.replace(/[\*\:{]/g, 'Ω');
  return collator.compare(x, y);
}
