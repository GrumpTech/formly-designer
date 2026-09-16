import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  output,
  inject,
} from '@angular/core';
import { AbstractControlDirective, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

@Component({
  selector: 'formly-form-field-control',
  template: `
    <div (focusin)="handleFocus()" (focusout)="handleFocusOut($event)">
      <ng-content />
    </div>
  `,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FormFieldControl,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldControl implements MatFormFieldControl<any> {
  ngControl: NgControl | AbstractControlDirective | null = null;
  readonly containerClick = output<MouseEvent>();
  readonly id: string;
  value = null;
  stateChanges = new Subject<void>();
  placeholder = '';
  focused = false;
  empty = false;
  shouldLabelFloat = true;
  required = false;
  disabled = false;
  errorState = false;
  controlType?: string | undefined;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;
  disableAutomaticLabeling?: boolean | undefined;
  describedByIds?: string[] | undefined;

  private elementRef = inject(ElementRef);
  private static nextId = 0;

  constructor() {
    this.id = `formly-form-field-control-${FormFieldControl.nextId++}`;
  }

  setDescribedByIds(ids: string[]): void {
    this.describedByIds = ids;
  }

  onContainerClick(event: MouseEvent): void {
    this.containerClick.emit(event);
  }

  handleFocus() {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  handleFocusOut(event: FocusEvent) {
    if (
      this.focused &&
      (!event.relatedTarget ||
        !this.elementRef.nativeElement.contains(event.relatedTarget))
    ) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
}
