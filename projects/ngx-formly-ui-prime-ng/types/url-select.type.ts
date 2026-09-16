import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FieldType,
  FieldTypeConfig,
  FormlyAttributes,
  FormlyFieldProps,
} from '@ngx-formly/core';
import { HttpCacheService } from '@grumptech/ngx-formly-ui-base';
import { Select } from 'primeng/select';
import { ReactiveFormsModule } from '@angular/forms';

interface UrlSelectProps extends FormlyFieldProps {
  url?: string;
  labelKey?: string;
  valueKey?: string;
}
@Component({
  selector: 'formly-p-url-select',
  template: `
    <p-select
      [id]="id"
      [placeholder]="props.placeholder"
      [options]="items"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [showClear]="!props.required"
      (onChange)="props.change && props.change(field, $event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Select, FormlyAttributes],
})
export class FormlyUrlSelect
  extends FieldType<FieldTypeConfig<UrlSelectProps>>
  implements OnInit
{
  items: any[] = [];

  private httpCacheService = inject(HttpCacheService);
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
          this.formControl.setValue(this.formControl.value);
        }
      });
  }
}
