import { ConfigOption } from '@ngx-formly/core';
import { withFormlyBaseValidation } from '@grumptech/ngx-formly-ui-base/validation';
import { withFormlyFieldApp } from '@grumptech/ngx-formly-ui-base/app';
import { withFormlyFieldAppMessageContainer } from '@grumptech/ngx-formly-ui-base/app-message-container';
import { withFormlyFieldErrorMessage } from '@grumptech/ngx-formly-ui-base/error-message';
import { withFormlyFieldMessage } from '@grumptech/ngx-formly-ui-base/message';
import { withFormlyFieldMessageContainer } from '@grumptech/ngx-formly-ui-base/message-container';
import { withFormlyFieldNull } from '@grumptech/ngx-formly-ui-base/null';
import { withFormlyFieldPage } from '@grumptech/ngx-formly-ui-base/page';

export function withFormlyUiBase(): ConfigOption[] {
  return [
    withFormlyFieldApp(),
    withFormlyFieldAppMessageContainer(),
    withFormlyFieldErrorMessage(),
    withFormlyFieldMessage(),
    withFormlyFieldMessageContainer(),
    withFormlyFieldNull(),
    withFormlyFieldPage(),
    withFormlyBaseValidation(),
  ];
}
