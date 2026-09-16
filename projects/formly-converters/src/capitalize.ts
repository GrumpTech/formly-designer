export function capitalize(value: string): string {
  return value.length ? value[0].toUpperCase() + value.slice(1) : '';
}
