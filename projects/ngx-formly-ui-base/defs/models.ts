import { Type } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

export type Severity = 'success' | 'information' | 'warning' | 'error';

export abstract class IFormLoader {
  abstract load: (name: string) => Observable<FormlyFieldConfig[]>;
}

export abstract class IMessageService {
  abstract showMessage: (severity: Severity, message: string) => void;
  abstract clearMessages: () => void;
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

export interface AppConfig {
  baseUrl: string;
  formLoader: Type<IFormLoader>;
  frontendBaseUrl?: string;
  actions?: Type<IAction>[];
  converters?: Type<IConverter>[];
  messageService?: Type<IMessageService>;
}
