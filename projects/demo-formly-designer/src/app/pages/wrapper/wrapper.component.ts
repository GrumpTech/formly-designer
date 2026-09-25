import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppAndFormsLoader } from '@grumptech/ngx-formly-form-loaders';
import { getApiPath, getSwaggerPath } from '../../methods/methods';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppAndFormsLoader],
})
export class Wrapper {
  protected showPage: boolean;

  constructor(route: ActivatedRoute) {
    const url = route.snapshot.url.map((s) => s.path).join('/');
    if (url.startsWith('open-api-client')) {
      this.showPage = getApiPath() !== '' && getSwaggerPath() !== '';
    } else {
      this.showPage = getApiPath() !== '';
    }
  }
}
