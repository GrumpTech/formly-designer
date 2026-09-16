import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonDirective } from 'primeng/button';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import {
  ActionService,
  PageService,
  SaveActionProps,
} from '@grumptech/ngx-formly-ui-base';

@Component({
  selector: 'formly-p-save-action',
  template: `
    @if (isEditable) {
      <button
        pButton
        type="button"
        [disabled]="formControl.disabled"
        (click)="save()"
        class="default-button"
      >
        {{ props.label }}
      </button>
      <button
        pButton
        type="button"
        [disabled]="formControl.disabled"
        class="p-button-secondary default-button"
        (click)="toggleEditable(false)"
      >
        Cancel
      </button>
    } @else {
      <button
        pButton
        type="button"
        [disabled]="formControl.disabled"
        class="default-button"
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
        margin-top: 5px;
        margin-bottom: 15px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
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
