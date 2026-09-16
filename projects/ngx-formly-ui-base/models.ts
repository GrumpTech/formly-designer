import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { MenuItem, Page } from '@grumptech/formly-converters';
import { ConverterService } from './services/converter-service';

export type Severity = 'success' | 'information' | 'warning' | 'error';

export abstract class IFormLoader {
  abstract load: (name: string) => Observable<FormlyFieldConfig[]>;
}

export abstract class IFormsLoader extends IFormLoader {
  abstract loadNames: () => Observable<string[]>;
}

export abstract class IAction {
  abstract get name(): string;
  abstract run(field: FormlyFieldConfig): Observable<void>;
}

export abstract class IConverter {
  abstract get type(): string;
  abstract convertInput(value: any): any;
  abstract convertOutput(value: any): any;
}

export abstract class IMessageService {
  abstract showMessage: (severity: Severity, message: string) => void;
  abstract clearMessages: () => void;
}

export interface AppProps extends FormlyFieldProps {
  menu?: MenuItem[];
  pages?: Page[];
}

export interface MessageProps extends FormlyFieldProps {
  title?: string;
  message?: string;
}

export interface ErrorMessageProps extends FormlyFieldProps {
  title?: string;
  message?: string;
  error?: any;
}

export interface PageProps extends FormlyFieldProps {
  navigationDisabled?: boolean;
  converterService?: ConverterService;
}

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

export interface DialogButtonProps extends FormlyFieldProps {
  form?: string;
}
