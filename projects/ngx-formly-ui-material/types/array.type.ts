import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {
  FieldArrayType,
  FieldTypeConfig,
  FormlyField,
  FormlyFieldProps,
  FormlyValidationMessage,
} from '@ngx-formly/core';

interface ArrayProps extends FormlyFieldProps {
  emptyArrayMessage?: string;
  addButtonLabel?: string;
}

@Component({
  selector: 'formly-mat-array',
  template: `
    <div>
      @if (props.label) {
        <mat-label>{{ props.label }}</mat-label>
      }
      @if (props.description) {
        <mat-hint>{{ props.description }}</mat-hint>
      }
      @if (showError && formControl.errors) {
        <mat-error>
          <formly-validation-message [field]="field" />
        </mat-error>
      }
      @if (!field.fieldGroup?.length) {
        <div class="empty-message">{{ props.emptyArrayMessage }}</div>
      }
      @for (field of field.fieldGroup; track field; let i = $index) {
        <div class="group">
          <formly-field [field]="field" />
          @if (!props.readonly) {
            <button
              mat-icon-button
              type="button"
              [disabled]="formControl.disabled"
              (click)="remove(i)"
              class="delete-button"
            >
              <mat-icon>delete</mat-icon>
            </button>
          }
        </div>
      }
      @if (!props.readonly) {
        <div>
          <button
            mat-stroked-button
            type="button"
            [disabled]="formControl.disabled"
            (click)="add()"
            class="add-button"
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
      .delete-button {
        margin-left: 5px;
        margin-bottom: 13px;
      }
      .add-button {
        margin-bottom: 22px;
      }
      .empty-message {
        font-style: italic;
        padding-bottom: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormFieldModule,
    FormlyField,
    FormlyValidationMessage,
  ],
})
export class FormlyArray extends FieldArrayType<FieldTypeConfig<ArrayProps>> {}
