import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.dialog.html',
  styleUrl: './settings.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatInput,
    MatButton,
  ],
})
export class SettingsDialog {
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
