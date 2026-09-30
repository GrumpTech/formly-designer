import { InjectionToken, Type } from '@angular/core';
import { IAction } from '@grumptech/ngx-formly-ui-base/defs';
import { LoadAction } from './actions/load.action';
import { SaveAction } from './actions/save.action';
import { SendAndClearAction } from './actions/send-and-clear.action';
import { SendAndCloseAction } from './actions/send-and-close.action';
import { SendAndNavigateAction } from './actions/send-and-navigate.action';
import { SendAndShowMessageAction } from './actions/send-and-show-message.action';
import { HttpActionBase } from './actions/http.action.base';

export const FORMLY_APP_ACTIONS = new InjectionToken<IAction[]>(
  'formlyAppActions',
);

export {
  HttpActionBase,
  LoadAction,
  SaveAction,
  SendAndClearAction,
  SendAndCloseAction,
  SendAndNavigateAction,
  SendAndShowMessageAction,
};

export const defaultActions: Type<IAction>[] = [
  LoadAction,
  SaveAction,
  SendAndClearAction,
  SendAndCloseAction,
  SendAndNavigateAction,
  SendAndShowMessageAction,
];
