import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { ButtonDirective } from 'primeng/button';
import {
  ActionService,
  ActionProps,
} from '@grumptech/ngx-formly-ui-base/action';

@Component({
  selector: 'formly-p-action',
  templateUrl: './action.type.html',
  styleUrl: './action.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
})
export class FormlyAction extends FieldType<FieldTypeConfig<ActionProps>> {
  private actionService = inject(ActionService);
  private destroyRef = inject(DestroyRef);

  protected run(): void {
    if (
      this.actionService.validateSelectionIsNotChanged(this.field) &&
      this.actionService.validate(this.field)
    ) {
      this.actionService
        .run(this.field)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }
}
