import { Injectable } from '@angular/core';
import { IMessageService, Severity } from '../models';

@Injectable()
export class ConsoleMessageService implements IMessageService {
  showMessage(severity: Severity, message: string) {
    switch (severity) {
      case 'error':
        console.error('PageMessageService:', message);
        break;
      case 'warning':
        console.warn('PageMessageService:', message);
        break;
      default:
        console.info('PageMessageService:', message);
    }
  }
  clearMessages() {}
}
