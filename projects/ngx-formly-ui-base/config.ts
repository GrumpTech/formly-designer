import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';
import { InjectionToken, Provider, Type } from '@angular/core';
import { IAction, IMessageService, IFormLoader, IConverter } from './models';
import { ConsoleMessageService } from './services/console-message-service';
import { HttpCacheService } from './services/http-cache-service';
import { ActionService } from './services/action-service';
import { FormlyApp } from './types/app.type';
import { FormlyErrorMessage } from './types/error-message.type';
import { FormlyMessage } from './types/message.type';
import { FormlyMessageContainer } from './types/message-container.type';
import { FormlyNull } from './types/null.type';
import { FormlyPage } from './types/page.type';
import { HttpActionBase } from './actions/http.action.base';
import { LoadAction } from './actions/load.action';
import { SaveAction } from './actions/save.action';
import { SendAndClearAction } from './actions/send-and-clear.action';
import { SendAndCloseAction } from './actions/send-and-close.action';
import { SendAndNavigateAction } from './actions/send-and-navigate.action';
import { SendAndShowMessageAction } from './actions/send-and-show-message.action';
import { DateConverter } from './converters/date-converter';
import { DateTimeConverter } from './converters/datetime-converter';
import { FormlyAppMessageContainer } from './types/app-message-container.type';

export const FORMLY_APP_CONFIG = new InjectionToken<AppConfig>(
  'formlyAppConfig',
);
export const FORMLY_APP_ACTIONS = new InjectionToken<IAction[]>(
  'formlyAppActions',
);
export const FORMLY_APP_CONVERTERS = new InjectionToken<IConverter[]>(
  'formlyAppConverters',
);

export interface AppConfig {
  baseUrl: string;
  frontendBaseUrl?: string;
  actions?: Type<IAction>[];
  converters?: Type<IConverter>[];
  formLoader?: Type<IFormLoader>;
  messageService?: Type<IMessageService>;
}

export const defaultActions: Type<IAction>[] = [
  LoadAction,
  SaveAction,
  SendAndClearAction,
  SendAndCloseAction,
  SendAndNavigateAction,
  SendAndShowMessageAction,
];

export const defaultConverters: Type<IConverter>[] = [
  DateConverter,
  DateTimeConverter,
];

export function provideFormlyAppConfig(config: AppConfig): Provider {
  config = {
    actions: defaultActions,
    converters: defaultConverters,
    ...config,
  };
  return [
    {
      provide: FORMLY_APP_CONFIG,
      useValue: config,
    },
    HttpCacheService,
    ActionService,
    ...(config.formLoader
      ? [
          {
            provide: IFormLoader,
            useExisting: config.formLoader,
          },
        ]
      : []),
    {
      provide: IMessageService,
      useClass: config.messageService ?? ConsoleMessageService,
    },
    HttpActionBase,
    ...(config.actions?.map((a) => ({
      provide: FORMLY_APP_ACTIONS,
      useClass: a,
      multi: true,
    })) ?? []),
    ...(config.converters?.map((a) => ({
      provide: FORMLY_APP_CONVERTERS,
      useClass: a,
      multi: true,
    })) ?? []),
  ];
}

export function withFormlyUiBase(): ConfigOption {
  return {
    validationMessages: [
      { name: 'required', message: 'Field is required' },
      { name: 'null', message: 'Should be null' },
      { name: 'minLength', message: minLengthValidationMessage },
      { name: 'maxLength', message: maxLengthValidationMessage },
      { name: 'min', message: minValidationMessage },
      { name: 'max', message: maxValidationMessage },
      { name: 'multipleOf', message: multipleOfValidationMessage },
      {
        name: 'exclusiveMinimum',
        message: exclusiveMinimumValidationMessage,
      },
      {
        name: 'exclusiveMaximum',
        message: exclusiveMaximumValidationMessage,
      },
      { name: 'pattern', message: patternValidationMessage },
      { name: 'minItems', message: minItemsValidationMessage },
      { name: 'maxItems', message: maxItemsValidationMessage },
      { name: 'uniqueItems', message: 'Should NOT have duplicate items' },
      { name: 'const', message: constValidationMessage },
    ],
    types: [
      { name: 'app', component: FormlyApp },
      { name: 'app-message-container', component: FormlyAppMessageContainer },
      { name: 'error-message', component: FormlyErrorMessage },
      { name: 'message', component: FormlyMessage },
      { name: 'message-container', component: FormlyMessageContainer },
      { name: 'null', component: FormlyNull },
      { name: 'page', component: FormlyPage },
    ],
  };
}

function minItemsValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should NOT have fewer than ${field.props?.minItems} items`;
}

function maxItemsValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should NOT have more than ${field.props?.maxItems} items`;
}

function minLengthValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should NOT be shorter than ${field.props?.minLength} characters`;
}

function maxLengthValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should NOT be longer than ${field.props?.maxLength} characters`;
}

function minValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should be >= ${field.props?.min}`;
}

function maxValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should be <= ${field.props?.max}`;
}

function multipleOfValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should be a multiple of ${field.props?.step}`;
}

function patternValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should follow pattern ${field.props?.pattern}`;
}

function exclusiveMinimumValidationMessage(
  _err: any,
  field: FormlyFieldConfig,
) {
  return `Should be > ${field.props?.step}`;
}

function exclusiveMaximumValidationMessage(
  _err: any,
  field: FormlyFieldConfig,
) {
  return `Should be < ${field.props?.step}`;
}

function constValidationMessage(_err: any, field: FormlyFieldConfig) {
  return `Should be equal to constant "${field.props?.const}"`;
}
