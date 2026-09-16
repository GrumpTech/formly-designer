import { capitalize } from '../capitalize';
import { compareUrls } from '../compare-urls';

export interface MenuItem {
  name: string;
  url?: string;
  children: MenuItem[];
}

export function generateMenu(urls: string[]): MenuItem[] {
  urls = urls.filter((i) => i.indexOf('{') === -1);
  urls.sort(compareUrls);
  const map = new Map<string, MenuItem>([['', { name: '', children: [] }]]);
  urls.forEach((i) => {
    addWithAncestorsRecursive(map, i, true);
  });
  return map.get('')?.children!;
}

function addWithAncestorsRecursive(
  map: Map<string, MenuItem>,
  key: string,
  fromUrl: boolean = false,
): void {
  const pos = key.lastIndexOf('/');
  const name = capitalize(
    (pos === -1 ? key : key.slice(pos + 1)).replaceAll('-', ' '),
  );
  const newItem = { name } as MenuItem;
  if (fromUrl) {
    newItem.url = key;
  }
  newItem.children = [];
  map.set(key, newItem);
  const parentKey = pos > 0 ? key.substring(0, pos) : '';
  let parent = map.get(parentKey);
  if (!parent) {
    addWithAncestorsRecursive(map, parentKey);
    parent = map.get(parentKey);
  }
  parent!.children.push(newItem);
}
