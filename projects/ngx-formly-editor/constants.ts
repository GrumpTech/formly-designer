import { InjectionToken } from '@angular/core';
import { EditorConfig } from './config';

export const FORMLY_EDITOR_CONFIG = new InjectionToken<EditorConfig>(
  'formlyEditorConfig',
);
