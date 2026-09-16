export function getLinkPaths(schema: any): string[] {
  const result: string[] = [];
  for (const path in schema.paths) {
    const getRequest = schema.paths[path]['get'];
    if (getRequest && path.endsWith('}')) {
      result.push(path);
    }
  }
  return result;
}
