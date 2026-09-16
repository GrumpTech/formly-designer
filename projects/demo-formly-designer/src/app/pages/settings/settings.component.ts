import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatInput,
    MatButton,
  ],
})
export class Settings {
  protected form = new FormGroup({
    backendUrl: new FormControl(''),
    swaggerUrl: new FormControl(''),
  });

  constructor() {
    this.form.setValue({
      backendUrl:
        localStorage.getItem(
          `${environment.storagePrefix}settings_backend_url`,
        ) ?? '',
      swaggerUrl:
        localStorage.getItem(
          `${environment.storagePrefix}settings_swagger_url`,
        ) ?? '',
    });
  }

  save() {
    localStorage.setItem(
      `${environment.storagePrefix}settings_backend_url`,
      this.form.get('backendUrl')?.value ?? '',
    );
    localStorage.setItem(
      `${environment.storagePrefix}settings_swagger_url`,
      this.form.get('swaggerUrl')?.value ?? '',
    );
    location.reload();
  }
}
