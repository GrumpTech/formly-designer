import { FormlyFieldProps } from '@ngx-formly/core';

export interface MessageProps extends FormlyFieldProps {
  title?: string;
  message?: string;
}
