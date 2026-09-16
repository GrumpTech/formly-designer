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
import { PageService } from '../services/page-service';
import { RouteParameterService } from '../services/route-parameter-service';
import { ConverterService } from '../services/converter-service';
import { IMessageService, PageProps } from '../models';

@Component({
  selector: 'formly-page',
  template: `
    <div class="max-width-container">
      @for (f of selectionFields; track f) {
        <formly-field [field]="f" />
      }
      @if (otherFields.length) {
        <div>
          Add fields using one of the keys path, query, body, result, buttons,
          or result-buttons
        </div>
      }
      @for (f of otherFields; track f) {
        <formly-field [field]="f" />
      }
      <div class="clearfix">
        @for (f of buttonFields; track f) {
          <formly-field [field]="f" />
        }
        @if (!buttonFields.length || hasVisibleResult()) {
          @for (f of resultButtonFields; track f) {
            <formly-field [field]="f" />
          }
        }
      </div>
      @if (model.newItemUrl) {
        <p><a [href]="model.newItemUrl">New item created</a></p>
      }
      @if (model.message) {
        <p>{{ model.message }}</p>
      }
    </div>
    @if (resultFields.length) {
      <div class="flex-container">
        <div class="max-width-container">
          @for (g of resultFields; track g) {
            <formly-field [field]="g" />
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      @use '@grumptech/ngx-basic-ui/thin-scrollbars';

      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .clearfix::after {
        content: '';
        display: table;
        clear: both;
      }
      .max-width-container {
        margin: 0 20px 0 20px;
        max-width: 800px;
      }
      .flex-container {
        flex: 1;
        overflow-y: auto;
        min-height: 50px;

        @include thin-scrollbars.scrollbars;
      }
    `,
  ],
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
