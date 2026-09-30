import { MenuItem, Page } from '@grumptech/formly-converters';
import { FormlyFieldProps } from '@ngx-formly/core';

export interface AppProps extends FormlyFieldProps {
  menu?: MenuItem[];
  pages?: Page[];
}
