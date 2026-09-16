import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  FieldArrayType,
  FormlyField,
  FormlyFieldConfig,
  FormlyFieldProps,
  FormlyValidationMessage,
} from '@ngx-formly/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

interface GridProps extends FormlyFieldProps {
  sortable?: boolean;
  emptyArrayMessage?: string;
  addButtonLabel?: string;
}
@Component({
  selector: 'formly-editor-grid',
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

      @if (field.fieldGroup?.length) {
        <div
          cdkDropListGroup
          class="grid"
          [style.gridTemplateColumns]="gridTemplateColumns"
        >
          @for (label of labels; track $index) {
            <span class="header">{{ label }}</span>
          }
          @for (field of field.fieldGroup; track field; let i = $index) {
            @if (props.sortable) {
              <div
                cdkDropList
                (cdkDropListDropped)="handleDrop($event.item.data, i)"
                class="drop-list"
              >
                <mat-icon cdkDrag [cdkDragData]="i" class="drag-indicator"
                  >drag_indicator</mat-icon
                >
              </div>
            }
            @if (field.fieldGroup) {
              @for (field of field.fieldGroup; track field) {
                <formly-field [field]="getFieldWithoutLabel(field)" />
              }
            } @else {
              <formly-field [field]="getFieldWithoutLabel(field)" />
            }
            @if (!props.readonly) {
              <button
                mat-icon-button
                type="button"
                [disabled]="formControl.disabled"
                (click)="remove(i)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            }
          }
        </div>
      } @else {
        <div class="empty-message">{{ props.emptyArrayMessage }}</div>
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
      .grid {
        display: grid;
        align-items: center;
        column-gap: 10px;

        > * {
          min-width: 0;
        }
      }
      .header {
        font-weight: bold;
        color: rgba(0, 0, 0, 0.6);
        padding: 0 0 1px 4px;
        font-size: 14px;
      }
      formly-field {
        width: 100%;
      }
      .empty-message {
        font-style: italic;
        padding-bottom: 10px;
      }
      .add-button {
        margin-bottom: 25px;
      }
      .drop-list {
        position: relative;
        height: 80%;
        width: 20px;
      }
      .drag-indicator {
        cursor: pointer;
        position: absolute;
        margin-top: auto;
        margin-bottom: auto;
        top: 0;
        bottom: 0;
      }
      .cdk-drop-list-dragging {
        opacity: 0.4;
        background-color: rgb(0, 0, 0, 0.2);
        border-radius: 4px;
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
    DragDropModule,
  ],
})
export class FormlyEditorGrid
  extends FieldArrayType<FormlyFieldConfig<GridProps>>
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

  handleDrop(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.model, previousIndex, currentIndex);
    this.formControl.patchValue(this.model);
    this.formControl.markAsDirty();
  }

  private getLabels(): string[] {
    const result: string[] = [];
    if (this.props.sortable) {
      result.push('');
    }
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
    if (this.props.sortable) {
      result.unshift('min-content');
    }
    if (!this.props.readonly) {
      result.push('min-content');
    }
    return result.join(' ');
  }
}
