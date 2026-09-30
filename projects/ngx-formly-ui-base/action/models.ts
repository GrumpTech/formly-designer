import { FormlyFieldProps } from '@ngx-formly/core';

export interface ActionProps extends FormlyFieldProps {
  url?: string;
  method?: string;
  inputGroups?: string[];
  action?: string;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
}

export interface SaveActionProps extends ActionProps {}

export interface LoadActionProps extends ActionProps {
  autoRun?: boolean;
}
