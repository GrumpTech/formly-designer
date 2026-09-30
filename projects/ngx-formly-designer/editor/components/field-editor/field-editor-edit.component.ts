import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { cleanInput } from '@grumptech/formly-converters';
import { MatxFullWidthFormFields } from '@grumptech/ngx-matx/full-width-form-fields';
import { DataManager } from '../../services/data-manager';
import { FieldTypesReader } from '../../services/field-types-reader';
import { EditorFieldsReader } from '../../services/editor-fields-reader';
import { SelectionManager } from '../../services/selection-manager';

@Component({
  selector: 'formly-designer-field-editor-edit',
  template: `
    <form [formGroup]="form">
      <matx-full-width-form-fields>
        <formly-form [fields]="fields()" [form]="form" [model]="formField()" />
      </matx-full-width-form-fields>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm, MatxFullWidthFormFields],
})
export class FormlyFieldEditorEdit implements OnInit {
  protected form = new UntypedFormGroup({});
  protected fields = signal<FormlyFieldConfig[]>([]);
  protected formField = signal<FormlyFieldConfig | null>(null);

  private editorFieldsReader = inject(EditorFieldsReader);
  private fieldTypesReader = inject(FieldTypesReader);
  private selectionManager = inject(SelectionManager<FormlyFieldConfig>);
  private dataManager = inject(DataManager);
  private destroyRef = inject(DestroyRef);
  private field!: FormlyFieldConfig;

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(200))
      .subscribe(() => this.save());
    this.selectionManager.onSelect
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((field) => {
        if (this.field !== field && field !== null) {
          this.save();
          this.field = field;
          this.updateForm(field);
          this.setValue(field);
        }
      });
  }

  save() {
    if (this.form.pristine) {
      return;
    }
    const formField = this.formField();
    if (this.field && formField) {
      this.form.markAsPristine();
      const currentField = this.field;
      this.field = structuredClone(formField);
      cleanInput(this.field);
      this.dataManager.updateField(currentField, this.field);
      if (currentField.type !== this.field.type) {
        this.updateForm(this.field);
      }
    }
  }

  private setValue(field: FormlyFieldConfig): void {
    field = structuredClone(field);
    field.props ??= {};
    this.formField.set(field);
  }

  private updateForm(field: FormlyFieldConfig): void {
    Object.keys(this.form.controls).forEach((i) => this.form.removeControl(i));
    this.fields.set(
      this.editorFieldsReader.getFields(this.fieldTypesReader.getType(field)),
    );
  }
}
