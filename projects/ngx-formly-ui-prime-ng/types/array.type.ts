import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FieldArrayType,
  FieldTypeConfig,
  FormlyField,
  FormlyFieldProps,
  FormlyValidationMessage,
} from '@ngx-formly/core';
import { ButtonDirective } from 'primeng/button';

interface ArrayProps extends FormlyFieldProps {
  emptyArrayMessage?: string;
  addButtonLabel?: string;
}
@Component({
  selector: 'formly-p-array',
  template: `
    <div>
      {{ props.label }}
      <div>
        @if (showError && formControl.errors) {
          <small class="p-error">
            <formly-validation-message [field]="field" />
          </small>
        }
      </div>
      @if (!field.fieldGroup?.length) {
        <div class="empty-message">{{ props.emptyArrayMessage }}</div>
      }
      @for (field of field.fieldGroup; track field; let i = $index) {
        <div class="group">
          <formly-field [field]="field" />
          @if (!props.readonly) {
            <button
              pButton
              [disabled]="formControl.disabled"
              icon="pi pi-trash"
              class="p-button-outlined p-button-danger delete-button"
              (click)="remove(i)"
            ></button>
          }
        </div>
      }
      @if (!props.readonly) {
        <div>
          <button
            pButton
            [disabled]="formControl.disabled"
            class="p-button-success array-button"
            (click)="add()"
          >
            {{ props.addButtonLabel ?? 'Add' }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .group {
        display: flex;
        align-items: flex-end;
      }
      formly-field {
        flex: 1;
      }
      .array-button {
        margin-top: 5px;
        margin-bottom: 15px;
        width: auto;
      }
      .delete-button {
        margin-left: 15px;
      }
      .empty-message {
        font-style: italic;
        padding-bottom: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, FormlyField, FormlyValidationMessage],
})
export class FormlyArray extends FieldArrayType<FieldTypeConfig<ArrayProps>> {}
