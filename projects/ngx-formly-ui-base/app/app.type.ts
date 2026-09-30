import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { Navigation } from '@grumptech/ngx-basic-ui/navigation';
import { Breadcrumb } from '@grumptech/ngx-basic-ui/breadcrumb';
import { FORMLY_APP_CONFIG } from '@grumptech/ngx-formly-ui-base/defs';
import { AppProps } from './models';
import { AppService } from './app-service';

@Component({
  selector: 'formly-app',
  templateUrl: './app.type.html',
  styleUrl: './app.type.scss',
  imports: [RouterOutlet, Navigation, Breadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppService],
})
export class FormlyApp
  extends FieldType<FormlyFieldConfig<AppProps>>
  implements OnInit
{
  protected appService = inject(AppService);
  protected appConfig = inject(FORMLY_APP_CONFIG);

  ngOnInit(): void {
    this.appService.initialize(this.field);
  }
}
