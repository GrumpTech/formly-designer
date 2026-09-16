import stringify from 'json-stable-stringify';

export function jsonStringify(data: any): string {
  return (
    stringify(data, {
      space: '  ',
      collapseEmpty: true,
    }) ?? ''
  );
}
