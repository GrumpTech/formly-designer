import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  DestroyRef,
  viewChild,
  Renderer2,
  afterNextRender,
  runInInjectionContext,
  Injector,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { debounceTime, fromEvent } from 'rxjs';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { toFlatArray } from '@grumptech/formly-converters';
import { DataManager } from '../../services/data-manager';
import { FieldMarker } from '../../services/field-marker';
import { SelectionManager } from '../../services/selection-manager';
import { DataValidator } from '../../services/data-validator';
import { InitialValueFactory } from '../../services/initial-value-factory';
import { EditorConfigReader } from '../../services/editor-config-reader';
import { DropContainerManager } from '../../services/drop-container-manager';

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface OverlayField {
  index: number;
  rect: Rect;
  field: FormlyFieldConfig;
}

@Component({
  selector: 'formly-designer-result-form',
  templateUrl: './result-form.component.html',
  styleUrl: './result-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormlyForm, CdkDrag],
})
export class ResultFormComponent implements OnInit {
  protected overlayFields = signal<OverlayField[]>([]);
  protected form = new FormGroup({});
  protected formlyFields = signal<FormlyFieldConfig[]>([]);
  protected model = signal<any>(undefined);

  private elementRef = inject(ElementRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private injector = inject(Injector);
  private dataManager = inject(DataManager);
  private selection = inject(SelectionManager<FormlyFieldConfig>);
  private marker = inject(FieldMarker);
  private dataValidator = inject(DataValidator);
  private initialValueFactory = inject(InitialValueFactory);
  private dropContainerManager = inject(DropContainerManager);
  private formRenderConfig = inject(EditorConfigReader).formRenderConfig;
  private destroyRef = inject(DestroyRef);
  private overlay = viewChild.required<ElementRef<HTMLDivElement>>('overlay');
  private renderer = inject(Renderer2);
  private dropIndex?: number;
  private dropSide: 'top' | 'bottom' = 'top';

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(200))
      .subscribe(() => this.render(this.dataManager.getFields()));
    this.dataManager.onChange.subscribe((fields) => this.render(fields));
    this.selection.onSelect.subscribe(() =>
      this.changeDetectorRef.detectChanges(),
    );
  }

  protected isSelected(field: FormlyFieldConfig): boolean {
    return this.selection.has(field);
  }

  protected handleClick(field: FormlyFieldConfig, event: MouseEvent): void {
    this.selection.select(field, event.ctrlKey, event.shiftKey);
  }

  protected dragMove(field: OverlayField, event: CdkDragMove) {
    if (this.selection.get().length !== 1 || !this.selection.has(field.field)) {
      this.selection.set([field.field]);
    }
    const rect = this.overlay().nativeElement.getBoundingClientRect();
    const position = {
      x: ((event.event as any).pageX ?? event.pointerPosition.x) - rect.x,
      y: ((event.event as any).pageY ?? event.pointerPosition.y) - rect.y,
    };
    const dropField = this.overlayFields()
      .slice()
      .reverse()
      .find(
        (i) =>
          position.x >= i.rect.left &&
          position.x <= rect.width - i.rect.right &&
          position.y >= i.rect.top &&
          position.y <= rect.height - i.rect.bottom,
      );
    const newDropIndex =
      dropField?.index !== field.index ? dropField?.index : undefined;
    this.renderDropPreview(
      newDropIndex,
      !dropField ||
        position.y <=
          (dropField.rect.top - dropField.rect.bottom + rect.height) / 2
        ? 'top'
        : 'bottom',
    );
  }

  protected drop(field: FormlyFieldConfig, event: CdkDragEnd) {
    this.renderDropPreview(undefined, 'top');
    event.source.reset();
    const element = document.elementFromPoint(
      event.dropPoint.x,
      event.dropPoint.y,
    );
    if (element?.parentElement !== this.overlay().nativeElement) {
      return;
    }
    const overlayRect = this.overlay().nativeElement.getBoundingClientRect();
    const index = parseInt((element as any).dataset.idx);
    const rect = this.overlayFields()[index].rect;
    const toField = this.overlayFields()[index].field;
    const afterField =
      event.dropPoint.y - overlayRect.top >
      (rect.top - rect.bottom + overlayRect.height) / 2;
    this.dataManager.moveToField(field, toField, afterField);
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
    this.formlyFields.set(this.dropContainerManager.add(formlyFields));
    this.changeDetectorRef.detectChanges();

    if (this.overlayFields().length) {
      runInInjectionContext(this.injector, () =>
        afterNextRender(() => this.renderOverlayFields(fieldByIdx)),
      );
    } else {
      requestAnimationFrame(() => this.renderOverlayFields(fieldByIdx));
    }
  }

  private markInvalidField(field: FormlyFieldConfig, message: string): void {
    field.type = 'formly-editor-warning';
    field.props ??= {};
    field.props.message = message;
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

  private renderOverlayFields(fieldByIdx: Map<string, FormlyFieldConfig>) {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.overlayFields.set(
      Object.values(
        (this.elementRef.nativeElement as Element).getElementsByTagName(
          'formly-field',
        ),
      )
        .slice(1)
        .map((i, idx) => {
          return {
            index: idx,
            rect: this.calculateRect(i, rect),
            field: fieldByIdx.get(
              this.marker.getIdFromElement(i) as string,
            ) as FormlyFieldConfig,
          };
        })
        .filter((i) => i.field),
    );
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

  private renderDropPreview(index: number | undefined, side: 'top' | 'bottom') {
    if (this.dropIndex !== index || this.dropSide !== side) {
      this.dropIndex !== undefined &&
        this.renderer.removeStyle(
          this.overlay().nativeElement.children[this.dropIndex],
          `border-${this.dropSide}`,
        );
      this.dropIndex = index;
      this.dropSide = side;
      index !== undefined &&
        this.renderer.setStyle(
          this.overlay().nativeElement.children[index],
          `border-${side}`,
          '2px solid black',
        );
    }
  }
}
