import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  FieldTypeConfig,
  FormlyAttributes,
  FormlyFieldProps,
} from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/material/form-field';
import { HttpCacheService } from '@grumptech/ngx-formly-ui-base';

interface UrlSelectProps extends FormlyFieldProps {
  url?: string;
  labelKey?: string;
  valueKey?: string;
}
@Component({
  selector: 'formly-mat-url-select',
  template: `
    <mat-select
      [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [required]="required"
    >
      @for (item of items; track item) {
        <mat-option [value]="item.value">{{ item.label }}</mat-option>
      }
    </mat-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSelect, MatOption, ReactiveFormsModule, FormlyAttributes],
})
export class FormlyUrlSelect
  extends FieldType<FieldTypeConfig<UrlSelectProps>>
  implements OnInit, OnDestroy
{
  items: { value: any; label: any }[] = [];

  private httpCacheService = inject(HttpCacheService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (!this.props.url || !this.props.valueKey || !this.props.labelKey) {
      return;
    }
    const valueKey = this.props.valueKey;
    const labelKey = this.props.labelKey;
    this.httpCacheService
      .getData(this.props.url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.items = ((data ?? []) as any[]).map((d) => ({
          value: d[valueKey],
          label: d[labelKey],
        }));
        if ((this.formControl.value ?? null) !== null) {
          this.changeDetectorRef.detectChanges();
        }
      });
  }
}
