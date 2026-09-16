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
  RouteParameterService,
} from '@grumptech/ngx-formly-ui-base';

@Component({
  selector: 'formly-p-action',
  template: `
    <button
      pButton
      type="button"
      [disabled]="formControl.disabled"
      (click)="run()"
      [class]="
        props.method === 'delete'
          ? 'p-button-danger delete-button'
          : props.method === 'get'
            ? 'p-button-secondary default-button'
            : 'default-button'
      "
    >
      {{ props.label }}
    </button>
  `,
  styles: [
    `
      .default-button,
      .delete-button {
        margin-top: 5px;
        margin-bottom: 15px;
        float: left;
        width: auto;
      }
      .delete-button {
        float: right;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
  providers: [RouteParameterService],
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
