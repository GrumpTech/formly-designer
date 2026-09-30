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
  templateUrl: './grid.type.html',
  styleUrl: './grid.type.scss',
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
