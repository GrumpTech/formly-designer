import { Injectable, inject } from '@angular/core';
import { MessageService as PrimeNgMessageService } from 'primeng/api';
import { IMessageService, Severity } from '@grumptech/ngx-formly-ui-base';

@Injectable()
export class MessageService implements IMessageService {
  private messageService = inject(PrimeNgMessageService);
  private summaryBySeverity: Record<string, string> = {
    error: 'Error',
    success: 'Success',
    warning: 'Warn',
    information: 'Info',
  };

  showMessage(severity: Severity, message: string) {
    if (this.summaryBySeverity[severity]) {
      this.messageService.add({
        severity: severity,
        summary: this.summaryBySeverity[severity],
        detail: message,
      });
    }
  }

  clearMessages(): void {
    this.messageService.clear();
  }
}
