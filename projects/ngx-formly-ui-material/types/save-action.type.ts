import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import {
  ActionService,
  SaveActionProps,
  PageService,
} from '@grumptech/ngx-formly-ui-base';

@Component({
  selector: 'formly-mat-save-action',
  template: `
    @if (isEditable) {
      <button
        mat-stroked-button
        type="button"
        [disabled]="formControl.disabled"
        color="primary"
        (click)="save()"
      >
        {{ props.label }}
      </button>
      <button
        mat-stroked-button
        type="button"
        [disabled]="formControl.disabled"
        (click)="toggleEditable(false)"
      >
        Cancel
      </button>
    } @else {
      <button
        mat-stroked-button
        type="button"
        [disabled]="formControl.disabled"
        color="primary"
        (click)="toggleEditable(true)"
      >
        Edit
      </button>
    }
  `,
  styles: [
    `
      button {
        min-width: 80px;
        margin-bottom: 15px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class FormlySaveAction extends FieldType<
  FieldTypeConfig<SaveActionProps>
> {
  protected get isEditable(): boolean {
    return (
      this.field.parent !== undefined &&
      this.pageService.isEnabled(this.field.parent, ['result'])
    );
  }

  private pageService = inject(PageService);
  private actionService = inject(ActionService);
  private destroyRef = inject(DestroyRef);

  protected save(): void {
    if (this.actionService.validate(this.field)) {
      this.actionService
        .run(this.field)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  protected toggleEditable(editable: boolean): void {
    const pageField = this.field.parent;
    if (!pageField) {
      return;
    }
    this.pageService.reset(pageField);
    if (this.actionService.validateSelectionIsNotChanged(this.field)) {
      this.pageService.toggleLoadActionEnabled(pageField, !editable);
      this.pageService.toggleEnabled(pageField, ['result'], editable);
      this.pageService.toggleEnabled(pageField, ['path', 'query'], !editable);
    }
  }
}
