import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FieldType,
  FieldTypeConfig,
  FormlyField,
  FormlyFieldConfig,
} from '@ngx-formly/core';
import { IMessageService } from '@grumptech/ngx-formly-ui-base/defs';
import { PageService } from './page-service';
import { RouteParameterService } from './route-parameter-service';
import { ConverterService } from './converter-service';
import { PageProps } from './models';

@Component({
  selector: 'formly-page',
  templateUrl: './page.type.html',
  styleUrl: './page.type.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyField],
  providers: [RouteParameterService, ConverterService],
})
export class FormlyPage
  extends FieldType<FieldTypeConfig<PageProps>>
  implements OnInit, OnDestroy
{
  protected selectionFields: FormlyFieldConfig[] = [];
  protected resultFields: FormlyFieldConfig[] = [];
  protected buttonFields: FormlyFieldConfig[] = [];
  protected resultButtonFields: FormlyFieldConfig[] = [];
  protected otherFields: FormlyFieldConfig[] = [];

  private pageService = inject(PageService);
  private routeParameterService = inject(RouteParameterService);
  private converterService = inject(ConverterService);
  private messageService = inject(IMessageService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.pageService.initialize(this.field);
    this.props.converterService = this.converterService;
    this.field.fieldGroup?.forEach((i) => {
      if (i.key === 'path' || i.key === 'query' || i.key === 'body') {
        this.selectionFields?.push(i);
      } else if (i.key === 'result') {
        this.resultFields?.push(i);
      } else if (i.key === 'buttons') {
        this.buttonFields.push(i);
      } else if (i.key === 'result-buttons') {
        this.resultButtonFields.push(i);
      } else {
        this.otherFields?.push(i);
      }
    });
    this.routeParameterService.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const parameters = this.routeParameterService.get();
        this.pageService.setData(this.field, ['path', 'query'], parameters);
      });
  }

  ngOnDestroy(): void {
    this.messageService.clearMessages();
  }

  hasVisibleResult(): boolean {
    return this.resultFields.some((i) => !i.hide);
  }
}
