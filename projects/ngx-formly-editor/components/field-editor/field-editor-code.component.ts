import {
  Component,
  OnInit,
  model,
  viewChild,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import JSON5 from 'json5';
import { CodeEditor } from '@grumptech/ngx-basic-ui/code-editor';
import {
  cleanInput,
  jsonParse,
  jsonParseFieldsAndValidate,
  jsonStringify,
} from '@grumptech/formly-converters';
import { SelectionManager } from '../../services/selection-manager';
import { DataManager } from '../../services/data-manager';
import { FieldTypesReader } from '../../services/field-types-reader';

@Component({
  selector: 'formly-designer-field-editor-code',
  template: `<b-code-editor
    [data]="data()"
    [formatter]="formatter"
    [validator]="validator"
    (validChange)="save()"
  />`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }
      b-code-editor {
        flex: 1;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeEditor],
})
export class FormlyFieldEditorCode implements OnInit {
  protected readonly data = model('');
  protected readonly formatter = (data: string) => {
    const result = jsonParse(data);
    return result.success ? jsonStringify(result.result) : data;
  };
  protected readonly validator = (data: string) => this.validate(data);

  private dataManager = inject(DataManager);
  private fieldTypes = inject(FieldTypesReader);
  private selection = inject(SelectionManager<FormlyFieldConfig>);
  private destroyRef = inject(DestroyRef);
  private readonly jsonEditorChild = viewChild.required(CodeEditor);
  private field!: FormlyFieldConfig;

  ngOnInit(): void {
    this.selection.onSelect
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((field) => {
        if (this.field !== field && field !== null) {
          this.save();
          this.field = field;
          if (field.fieldArray || field.fieldGroup) {
            field = { ...field };
            delete field.fieldGroup;
            delete field.fieldArray;
          }
          this.data.set(JSON.stringify(field));
        }
      });
  }

  save() {
    const data = this.jsonEditorChild().getData();
    if (!data || !this.validator(data).valid) {
      return;
    }
    const currentField = this.field;
    this.field = JSON5.parse(data);
    this.field.fieldGroup = currentField.fieldGroup;
    this.field.fieldArray = currentField.fieldArray;
    cleanInput(this.field);
    this.dataManager.updateField(currentField, this.field);
  }

  private validate(data: string): { valid: boolean; message: string } {
    const result = jsonParseFieldsAndValidate(data);
    if (
      !result.success ||
      !(result.result[0].fieldArray || result.result[0].fieldGroup)
    ) {
      return { valid: result.success, message: result.message };
    }
    const field = result.result[0];
    if (field.fieldArray && !this.fieldTypes.isFieldArray(field)) {
      return {
        valid: false,
        message: `Can not add /fieldArray to field type '${this.fieldTypes.getType(
          field,
        )}'.`,
      };
    }
    if (field.fieldGroup && !this.fieldTypes.isFieldGroup(field)) {
      return {
        valid: false,
        message: `Can not add /fieldGroup to field type '${this.fieldTypes.getType(
          field,
        )}'.`,
      };
    }
    return {
      valid: false,
      message: "Add fields to /fieldArray or /fieldGroup with 'Add field'.",
    };
  }
}
