import { Provider } from '@angular/core';
import {
  IMessageService,
  IFormLoader,
  AppConfig,
  FORMLY_APP_CONFIG,
} from '@grumptech/ngx-formly-ui-base/defs';
import {
  FORMLY_APP_CONVERTERS,
  defaultConverters,
} from '@grumptech/ngx-formly-ui-base/page';
import {
  ActionService,
  FORMLY_APP_ACTIONS,
  HttpCacheService,
  defaultActions,
  HttpActionBase,
} from '@grumptech/ngx-formly-ui-base/action';
import { ConsoleMessageService } from './console-message-service';

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
    HttpActionBase,
    {
      provide: IFormLoader,
      useClass: config.formLoader,
    },
    {
      provide: IMessageService,
      useClass: config.messageService ?? ConsoleMessageService,
    },
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
