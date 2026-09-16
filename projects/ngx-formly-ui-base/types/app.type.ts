import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FieldType, FormlyField, FormlyFieldConfig } from '@ngx-formly/core';
import { AppProps } from '../models';
import { AppService } from '../services/app-service';

@Component({
  selector: 'formly-app',
  template: `
    @for (f of leftSideFields; track f) {
      <formly-field [field]="f" />
    }
    <div class="container">
      @for (f of headerFields; track f) {
        <formly-field [field]="f" />
      }
      @if (!headerFields.length) {
        <div class="spacing"></div>
      }
      @if (otherFields.length) {
        <div>
          Add fields using one of the keys leftSidebar, rightSidebar, header, or
          footer
        </div>
      }
      @for (f of otherFields; track f) {
        <formly-field [field]="f" />
      }
      <div
        class="page-container"
        [class.flex]="headerFields.length || footerFields.length"
      >
        <router-outlet />
      </div>
      @for (f of footerFields; track f) {
        <formly-field [field]="f" />
      }
    </div>
    @for (f of rightSideFields; track f) {
      <formly-field [field]="f" />
    }
  `,
  styles: [
    `
      @use '@grumptech/ngx-basic-ui/thin-scrollbars';

      :host {
        display: flex;
        height: 100%;
      }
      .container {
        display: flex;
        flex-direction: column;
        flex: 1;

        @include thin-scrollbars.scrollbars;
      }
      .page-container {
        min-height: 0;
      }
      .flex {
        flex: 1;
      }
      .spacing {
        height: 20px;
      }
    `,
  ],
  imports: [RouterOutlet, FormlyField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppService],
})
export class FormlyApp
  extends FieldType<FormlyFieldConfig<AppProps>>
  implements OnInit
{
  protected leftSideFields: FormlyFieldConfig[] = [];
  protected rightSideFields: FormlyFieldConfig[] = [];
  protected headerFields: FormlyFieldConfig[] = [];
  protected footerFields: FormlyFieldConfig[] = [];
  protected otherFields: FormlyFieldConfig[] = [];

  private appService = inject(AppService);

  ngOnInit(): void {
    this.appService.initialize(this.field);
    this.field.fieldGroup?.forEach((i) => {
      if (i.key === 'leftSidebar') {
        this.leftSideFields.push(i);
      } else if (i.key === 'rightSidebar') {
        this.rightSideFields.push(i);
      } else if (i.key === 'header') {
        this.headerFields.push(i);
      } else if (i.key === 'footer') {
        this.footerFields.push(i);
      } else {
        this.otherFields.push(i);
      }
    });
  }
}
