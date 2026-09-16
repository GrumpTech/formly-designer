import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMessageService, Severity } from '@grumptech/ngx-formly-ui-base';

@Injectable()
export class MessageService implements IMessageService {
  private snackBar = inject(MatSnackBar);
  private hidden = true;

  showMessage(_: Severity, message: string): void {
    this.hidden = false;
    this.snackBar.open(message, 'X');
  }

  clearMessages(): void {
    // setTimeout (and this.hidden) is a workaround for https://github.com/angular/components/issues/11357
    this.hidden = true;
    setTimeout(() => this.hidden && this.snackBar.dismiss());
  }
}
