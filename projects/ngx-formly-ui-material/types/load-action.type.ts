import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import {
  ActionService,
  RouteParameterService,
  LoadActionProps,
} from '@grumptech/ngx-formly-ui-base';

@Component({
  selector: 'formly-mat-load-action',
  template: `@if (!hidden) {
    <button
      mat-stroked-button
      type="button"
      [disabled]="formControl.disabled"
      (click)="navigateOrRun()"
    >
      {{ props.label }}
    </button>
  }`,
  styles: [
    `
      button {
        min-width: 80px;
        margin-bottom: 15px;
        margin-right: 10px;
        float: left;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RouteParameterService],
  imports: [MatButton],
})
export class FormlyLoadAction
  extends FieldType<FieldTypeConfig<LoadActionProps>>
  implements OnInit
{
  protected hidden = false;

  private actionService = inject(ActionService);
  private routeParameterService = inject(RouteParameterService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.hidden = this.actionService.shouldHide(this.field);
    if (this.props.autoRun) {
      this.routeParameterService.events
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.run());
    }
  }

  protected navigateOrRun(): void {
    if (!this.actionService.validate(this.field)) {
      return;
    }
    const isNavigationEnabled = this.actionService.isNavigationEnabled(
      this.field,
    );
    let shouldRun = !this.props.autoRun || !isNavigationEnabled;
    if (isNavigationEnabled) {
      const { path, query } = this.actionService.getData(this.field);
      if (this.routeParameterService.hasChanged({ path, query })) {
        this.routeParameterService.set({ path, query });
      } else {
        shouldRun = true;
      }
    }
    if (shouldRun) {
      this.run();
    }
  }

  private run(): void {
    this.actionService
      .run(this.field)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
