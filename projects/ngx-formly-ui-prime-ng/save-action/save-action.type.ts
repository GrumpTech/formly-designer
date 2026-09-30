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
  SaveActionProps,
} from '@grumptech/ngx-formly-ui-base/action';
import { PageService } from '@grumptech/ngx-formly-ui-base/page';

@Component({
  selector: 'formly-p-save-action',
  templateUrl: './save-action.type.html',
  styleUrl: './save-action.type.scss',
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
