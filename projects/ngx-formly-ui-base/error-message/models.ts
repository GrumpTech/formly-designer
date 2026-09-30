import { FormlyFieldProps } from '@ngx-formly/core';

export interface ErrorMessageProps extends FormlyFieldProps {
  title?: string;
  message?: string;
  error?: any;
}
