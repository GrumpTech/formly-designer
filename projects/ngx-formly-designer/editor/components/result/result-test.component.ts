import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyForm,
  FormlyFormOptions,
} from '@ngx-formly/core';
import { MatButton } from '@angular/material/button';
import { toFlatArray } from '@grumptech/formly-converters';
import { InitialValueFactory } from '../../services/initial-value-factory';
import { DataManager } from '../../services/data-manager';
import { TestValueManager } from '../../services/test-value-manager';
import { EditorConfigReader } from '../../services/editor-config-reader';

@Component({
  selector: 'formly-designer-result-test',
  templateUrl: './result-test.component.html',
  styleUrl: './result-test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, FormlyForm],
})
export class ResultTestComponent implements AfterViewInit {
  form = new UntypedFormGroup({});
  formlyOptions: FormlyFormOptions = {};
  formlyFields: FormlyFieldConfig[] = [];
  model: any;

  private dataManager = inject(DataManager);
  private initialValueFactory = inject(InitialValueFactory);
  private testValueManager = inject(TestValueManager);
  private formRenderConfig = inject(EditorConfigReader).formRenderConfig;
  private destroyRef = inject(DestroyRef);
  private fields: FormlyFieldConfig[] = [];

  constructor() {
    this.fields = this.dataManager.getFields();
    this.reset();
  }

  ngAfterViewInit() {
    this.testValueManager.set(this.model);
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.testValueManager.set(this.model));
  }

  reset(): void {
    const value = this.initialValueFactory.create(this.fields);
    this.model = value;
    this.form.reset(value);
    const formlyFields = structuredClone(this.fields);
    toFlatArray(formlyFields).forEach((i) =>
      this.formRenderConfig.testFormFieldConverter(i),
    );
    this.formlyFields = formlyFields;
    this.testValueManager.set(this.model);
  }

  validate(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
  }
}
