import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldTypesReader } from './field-types-reader';

@Injectable()
export class DropContainerManager {
  private fieldTypesReader = inject(FieldTypesReader);

  add(fields: FormlyFieldConfig[]): FormlyFieldConfig[] {
    this.addRecursive(fields);
    return fields;
  }

  private addRecursive(
    fields: FormlyFieldConfig[],
    parent?: FormlyFieldConfig,
  ): void {
    fields.forEach((i) => {
      this.addRecursiveForField(i);
    });
    if (parent && parent.type !== 'page' && !parent.fieldGroup?.length) {
      fields.push({
        type: 'formly-editor-drop-container',
        props: { message: parent?.type },
      });
    }
  }

  private addRecursiveForField(field: FormlyFieldConfig): void {
    if (this.fieldTypesReader.isFieldGroup(field)) {
      field.fieldGroup ??= [];
      return this.addRecursive(field.fieldGroup, field);
    }
    if (this.fieldTypesReader.isFieldArray(field)) {
      if (typeof field.fieldArray === 'object') {
        field.fieldArray.fieldGroup ??= [];
        this.addRecursive(field.fieldArray.fieldGroup, field.fieldArray);
      }
    }
  }
}
