import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { toFlatArray } from '@grumptech/formly-converters';
import { FieldTypesReader } from './field-types-reader';

@Injectable()
export class DataValidator {
  private fieldTypesReader = inject(FieldTypesReader);

  validate(fields: FormlyFieldConfig[]): Map<FormlyFieldConfig, string> {
    const result = new Map<FormlyFieldConfig, string>();
    if (fields.length > 1) {
      this.validateField({ fieldGroup: fields }, result);
    }
    toFlatArray(fields).forEach((i, idx) => {
      if (
        idx !== 0 ||
        fields.length > 1 ||
        !this.fieldTypesReader.isFieldArray(i)
      ) {
        this.validateField(i, result);
      }
    });
    return result;
  }

  private validateField(
    field: FormlyFieldConfig,
    messages: Map<FormlyFieldConfig, string>,
  ): void {
    if (!this.fieldTypesReader.hasExistingType(field)) {
      messages.set(field, `Unknown field type '${field.type}'`);
    }
    if (field.fieldGroup?.length) {
      field.fieldGroup
        ?.filter((i) => !i.key && this.fieldTypesReader.isFieldArray(i))
        ?.forEach((i) =>
          messages.set(i, 'Field array in a group should have a key'),
        );
    }
  }
}
