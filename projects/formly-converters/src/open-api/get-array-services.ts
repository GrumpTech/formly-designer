import { getLinkPaths } from './get-link-paths';

export interface ArrayService {
  url: string;
  valueKey: string;
  labelKey: string;
}

export function getArrayServices(schema: any): ArrayService[] {
  const pathParameterByPath = new Map<string, string>();
  getLinkPaths(schema).forEach((i) => {
    const lastPart = i.match(/\/{([^/]*)}$/);
    if (lastPart) {
      pathParameterByPath.set(
        i.toLowerCase().slice(0, -lastPart[0].length),
        lastPart[1],
      );
    }
  });
  const result: ArrayService[] = [];
  for (const path in schema.paths) {
    const getRequest = schema.paths[path]['get'];
    if (getRequest && !getRequest['parameters']?.length) {
      const data =
        getRequest['responses']['200']['content']['application/json']['schema'];
      const properties =
        data.type === 'array' && data.items.type === 'object'
          ? data.items.properties
          : {};
      const pathParameter = pathParameterByPath.get(path.toLowerCase());
      const valueKeyNames = ['id'];
      pathParameter && valueKeyNames.unshift(pathParameter);
      const valueKey = getFirstKey(properties, valueKeyNames);
      const labelKey = getFirstKey(properties, ['name', `${valueKey}`]);
      if (valueKey && labelKey) {
        result.push({ url: path, valueKey: valueKey, labelKey: labelKey });
      }
    }
  }
  return result;
}

function getFirstKey(object: any, keys: string[]): string | null {
  const fields = new Map(Object.keys(object).map((i) => [i.toLowerCase(), i]));
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i].toLowerCase();
    if (fields.has(key)) {
      return fields.get(key)!;
    }
  }
  return null;
}
