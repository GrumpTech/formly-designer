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
  ActionProps,
  RouteParameterService,
} from '@grumptech/ngx-formly-ui-base';

@Component({
  selector: 'formly-mat-action',
  template: `
    <button
      mat-stroked-button
      type="button"
      [disabled]="formControl.disabled"
      (click)="run()"
      [class]="props.method === 'delete' ? 'delete-button' : ''"
      [color]="
        props.method === 'delete'
          ? 'warn'
          : props.method === 'get'
            ? ''
            : 'primary'
      "
    >
      {{ props.label }}
    </button>
  `,
  styles: [
    `
      button {
        min-width: 80px;
        margin-bottom: 15px;
        float: left;
      }
      .delete-button {
        float: right;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RouteParameterService],
  imports: [MatButton],
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
