import { compareUrls } from '../compare-urls';
import { capitalize } from '../capitalize';

export interface Page {
  url: string;
  breadcrumbParts?: BreadcrumbPart[];
}

export interface BreadcrumbPart {
  label: string;
  url?: string;
}

export function generatePages(urls: string[]): Page[] {
  const urlSet = new Set(urls);
  urls.sort(compareUrls);
  return urls.map((i) => ({
    url: i,
    breadcrumbParts: generateBreadcrumbParts(i, urlSet),
  }));
}

function generateBreadcrumbParts(
  url: string,
  urlSet: Set<string>,
): BreadcrumbPart[] {
  const parts = url.split('/');
  let partialUrl = '';
  const result: BreadcrumbPart[] = [];

  for (let i = 0, l = parts.length; i < l; i++) {
    const part = parts[i];
    partialUrl += `${i > 0 ? '/' : ''}${part}`;
    const label = part.startsWith('{') ? part : generateLabel(part);
    result.push(
      i < l - 1 && urlSet.has(partialUrl)
        ? { label, url: partialUrl }
        : { label },
    );
  }
  return result.length > 1 ? result : [];
}

function generateLabel(urlPart: string): string {
  return capitalize(urlPart.replaceAll('-', ' ').replace(/([A-Z])/g, ' $1'))
    .replaceAll('  ', ' ')
    .replace(/^ /, '');
}
