import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormLoader } from '@grumptech/ngx-formly-ui-base/loaders';

@Component({
  selector: 'formly-p-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DialogModule, FormLoader],
})
export class FormDialog {
  visible = model(false);
  title = input('');
  form = input('');
  onHide = output();

  protected hide(): void {
    this.onHide.emit();
  }
}
