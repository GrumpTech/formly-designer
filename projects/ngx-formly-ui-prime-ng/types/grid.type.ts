import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FieldArrayType,
  FieldTypeConfig,
  FormlyField,
  FormlyFieldConfig,
  FormlyFieldProps,
  FormlyValidationMessage,
} from '@ngx-formly/core';
import { ButtonDirective } from 'primeng/button';

interface GridProps extends FormlyFieldProps {
  emptyArrayMessage?: string;
  addButtonLabel?: string;
}
@Component({
  selector: 'formly-p-grid',
  template: `
    <div>
      @if (props.label) {
        <label>{{ props.label }}</label>
      }
      <div>
        @if (showError && formControl.errors) {
          <small class="p-error">
            <formly-validation-message [field]="field" />
          </small>
        }
      </div>

      @if (field.fieldGroup?.length) {
        <div class="grid" [style.gridTemplateColumns]="gridTemplateColumns">
          @for (label of labels; track label) {
            <span class="header">{{ label }}</span>
          }
          @for (field of field.fieldGroup; track field; let i = $index) {
            @if (field.fieldGroup) {
              @for (field of field.fieldGroup; track field) {
                <formly-field [field]="getFieldWithoutLabel(field)" />
              }
            } @else {
              <formly-field [field]="getFieldWithoutLabel(field)" />
            }
            @if (!props.readonly) {
              <button
                pButton
                [disabled]="formControl.disabled"
                icon="pi pi-trash"
                class="p-button-outlined p-button-danger"
                (click)="remove(i)"
              ></button>
            }
          }
        </div>
      } @else {
        <div class="empty-message">{{ props.emptyArrayMessage }}</div>
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
      .grid {
        display: grid;
        align-items: center;
        column-gap: 10px;
        row-gap: 5px;

        > * {
          min-width: 0;
        }
      }
      .header {
        font-weight: bold;
        color: rgba(0, 0, 0, 0.6);
        padding: 0 0 1px 4px;
      }
      .empty-message {
        font-style: italic;
        padding-bottom: 10px;
      }
      .array-button {
        width: auto;
        margin-top: 5px;
        margin-bottom: 15px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, FormlyField, FormlyValidationMessage],
})
export class FormlyGrid
  extends FieldArrayType<FieldTypeConfig<GridProps>>
  implements OnInit
{
  labels: string[] = [];
  gridTemplateColumns = '';

  private minContentTypes = new Set(['check', 'boolean']);

  ngOnInit(): void {
    this.labels = this.getLabels();
    this.gridTemplateColumns = this.getGridTemplateColumns();
  }

  getFieldWithoutLabel(field: FormlyFieldConfig): FormlyFieldConfig {
    if (field.props?.label) {
      delete field.props.label;
    }
    return field;
  }

  private getLabels(): string[] {
    const result: string[] = [];
    if (typeof this.field.fieldArray === 'object') {
      if (this.field.fieldArray.fieldGroup) {
        this.field.fieldArray.fieldGroup.forEach((i) =>
          result.push(i.props?.label ?? ''),
        );
      } else {
        result.push(this.field.fieldArray.props?.label ?? '');
      }
    }
    if (!this.props.readonly) {
      result.push('');
    }
    return result;
  }

  private getGridTemplateColumns(): string {
    const columns =
      typeof this.field.fieldArray === 'object'
        ? (this.field.fieldArray.fieldGroup ?? [this.field.fieldArray])
        : [];
    const result = columns.map((i) =>
      typeof i.type === 'string' && this.minContentTypes.has(i.type)
        ? 'min-content'
        : 'auto',
    );
    if (!this.props.readonly) {
      result.push('min-content');
    }
    return result.join(' ');
  }
}
