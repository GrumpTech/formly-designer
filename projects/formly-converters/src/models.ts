import { FormlyFieldConfig } from '@ngx-formly/core';

export interface Form {
  name: string;
  fields: FormlyFieldConfig[];
}

export interface Result<T> {
  success: boolean;
  message: string;
  result: T;
}
