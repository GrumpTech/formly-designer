import { Injectable, inject } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldTypesReader } from './field-types-reader';
import { EditorConfigReader } from './editor-config-reader';

@Injectable()
export class EditorFieldsReader {
  private fieldTypesReader = inject(FieldTypesReader);
  private properties: { [key: string]: FormlyFieldConfig };
  private propertiesByType: { [key: string]: string[] };

  constructor() {
    const config = inject(EditorConfigReader);
    this.properties = config.properties;
    this.propertiesByType = config.propertiesByType;
  }

  getFields(type: string): FormlyFieldConfig[] {
    const result: FormlyFieldConfig[] = [];
    if (!this.propertiesByType[type]) {
      console.warn(`Editor config reader: No fields for type ${type} found`);
    }
    (this.propertiesByType[type] ?? []).forEach((i) => {
      if (!this.properties[i]) {
        console.warn(
          `Editor config reader: Field with key ${i} for type ${type} not found`,
        );
        return;
      }
      const field = structuredClone(this.properties[i]);
      if (field.key === 'type' && !field.props?.options) {
        field.props ??= {};
        field.props.options = this.getOptions(type).filter(
          (i) => this.propertiesByType[i.value],
        );
      }
      if (field.key === 'props.menu' && !field.props?.options) {
        field.props ??= {};
      }
      result.push(field);
    });
    return [{ type: 'formly-editor-group', fieldGroup: result }];
  }

  private getOptions(type: string): { value: string; label: string }[] {
    if (this.fieldTypesReader.isFieldArray({ type: type })) {
      return this.fieldTypesReader
        .getArrayTypes()
        .map((i) => ({ value: i, label: i }));
    }
    if (this.fieldTypesReader.isFieldGroup({ type: type })) {
      return this.fieldTypesReader
        .getGroupTypes()
        .map((i) => ({ value: i, label: i }));
    }
    return this.fieldTypesReader
      .getStandardTypes()
      .map((i) => ({ value: i, label: i }));
  }
}
