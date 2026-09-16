import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { MessageProps } from '../models';

@Component({
  selector: 'formly-message',
  template: `
    <h2>{{ props.title ?? '' }}</h2>
    <p>{{ props.message ?? '' }}</p>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyMessage extends FieldType<FormlyFieldConfig<MessageProps>> {}
