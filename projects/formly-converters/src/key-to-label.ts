export function keyToLabel(key: string): string {
  const label = key
    .replace(/([A-Z]+)/g, ' $1')
    .replace(/([A-Z][^A-Z])/g, (x) => x[0].toLowerCase() + x[1])
    .trimStart();
  return label[0].toUpperCase() + label.slice(1);
}
