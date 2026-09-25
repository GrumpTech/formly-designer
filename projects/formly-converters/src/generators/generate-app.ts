import { FormlyFieldConfig } from '@ngx-formly/core';
import { generateMenu } from './generate-menu';
import { generatePages } from './generate-pages';

export function generateApp(names: string[]): FormlyFieldConfig[] {
  return [
    {
      type: 'app',
      props: {
        menu: generateMenu(names),
        pages: generatePages(names),
      },
    },
  ];
}
