import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, fromEvent } from 'rxjs';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { toFlatArray } from '@grumptech/formly-converters';
import { DataManager } from '../../services/data-manager';
import { FieldMarker } from '../../services/field-marker';
import { SelectionManager } from '../../services/selection-manager';
import { DataValidator } from '../../services/data-validator';
import { InitialValueFactory } from '../../services/initial-value-factory';
import { EditorConfigReader } from '../../services/editor-config-reader';

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface OverlayField {
  rect: Rect;
  field: FormlyFieldConfig;
}

@Component({
  selector: 'formly-designer-result-form',
  templateUrl: './result-form.component.html',
  styleUrl: './result-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm],
})
export class ResultFormComponent implements OnInit {
  protected overlayFields = signal<OverlayField[]>([]);
  protected form = new FormGroup({});
  protected formlyFields = signal<FormlyFieldConfig[]>([]);
  protected model = signal<any>(undefined);

  private elementRef = inject(ElementRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private dataManager = inject(DataManager);
  private selection = inject(SelectionManager<FormlyFieldConfig>);
  private marker = inject(FieldMarker);
  private dataValidator = inject(DataValidator);
  private initialValueFactory = inject(InitialValueFactory);
  private formRenderConfig = inject(EditorConfigReader).formRenderConfig;
  private changeDectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(200))
      .subscribe(() => this.render(this.dataManager.getFields()));
    this.dataManager.onChange.subscribe((fields) => this.render(fields));
    this.selection.onSelect.subscribe(() =>
      this.changeDectorRef.detectChanges(),
    );
  }

  protected isSelected(field: FormlyFieldConfig): boolean {
    return this.selection.has(field);
  }

  protected handleClick(field: FormlyFieldConfig, event: MouseEvent): void {
    this.selection.select(field, event.ctrlKey, event.shiftKey);
  }

  protected overlayFieldTrackBy(
    _index: number,
    item: OverlayField,
  ): FormlyFieldConfig {
    return item.field;
  }

  private render(fields: FormlyFieldConfig[]) {
    const fieldByIdx = new Map(
      toFlatArray(fields).map((i, idx) => [`${idx}`, i]),
    );
    const formlyFields = structuredClone(fields);
    const validationMessages = this.dataValidator.validate(formlyFields);
    toFlatArray(formlyFields).forEach((i, idx) => {
      this.formRenderConfig.editFormFieldConverter(i);
      this.marker.markField(i, `${idx}`);
      const validationMessage = validationMessages.get(i);
      if (validationMessage) {
        this.markInvalidField(i, validationMessage);
      }
    });
    this.clearForm(this.initialValueFactory.create(formlyFields, 1));
    this.formlyFields.set(formlyFields);
    this.changeDetectorRef.detectChanges();

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.overlayFields.set(
      Object.values(
        (this.elementRef.nativeElement as Element).getElementsByTagName(
          'formly-field',
        ),
      )
        .map((i) => ({
          rect: this.calculateRect(i, rect),
          field: fieldByIdx.get(
            this.marker.getIdFromElement(i) as string,
          ) as FormlyFieldConfig,
        }))
        .filter((i) => i.field),
    );
  }
  private markInvalidField(field: FormlyFieldConfig, message: string): void {
    field.type = 'formly-template';
    field.template = message;
    if (field.fieldArray) {
      delete field.fieldArray;
    }
    if (field.fieldGroup) {
      delete field.fieldGroup;
    }
  }
  private clearForm(value: any): void {
    Object.keys(this.form.controls).forEach((i) => this.form.removeControl(i));
    this.form.reset(value);
    this.model.set(value);
  }
  private calculateRect(element: Element, container: DOMRect): Rect {
    const result: Rect = {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      right: 0,
      bottom: 0,
    };
    [element]
      .concat(Object.values(element.querySelectorAll('*')))
      .forEach((i) => {
        const rect = i.getBoundingClientRect();
        if (rect.width && rect.height) {
          result.left = Math.min(rect.left, result.left);
          result.top = Math.min(rect.top, result.top);
          result.right = Math.max(rect.right, result.right);
          result.bottom = Math.max(rect.bottom, result.bottom);
        }
      });
    return {
      left: Math.max(result.left - container.left, 0),
      top: Math.max(result.top - container.top, 0),
      right: Math.min(container.right - result.right, container.width),
      bottom: Math.min(container.bottom - result.bottom, container.height),
    };
  }
}
