import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {
  FieldArrayType,
  FieldTypeConfig,
  FormlyField,
  FormlyFieldConfig,
  FormlyFieldProps,
  FormlyValidationMessage,
} from '@ngx-formly/core';

interface GridProps extends FormlyFieldProps {
  emptyArrayMessage?: string;
  addButtonLabel?: string;
}

@Component({
  selector: 'formly-mat-grid',
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
  ],
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
