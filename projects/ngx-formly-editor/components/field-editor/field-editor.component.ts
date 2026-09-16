import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  viewChild,
  inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatxPanel, MatxPanelHeaderButton } from '@grumptech/ngx-matx/panel';
import { SelectionManager } from '../../services/selection-manager';
import { FormlyFieldEditorEdit } from './field-editor-edit.component';
import { FormlyFieldEditorCode } from './field-editor-code.component';
import { FormlyFieldEditorAdd } from './field-editor-add.component';

@Component({
  selector: 'formly-designer-field-editor',
  templateUrl: './field-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormlyFieldEditorEdit,
    FormlyFieldEditorCode,
    FormlyFieldEditorAdd,
    MatxPanel,
    MatxPanelHeaderButton,
  ],
})
export class FormlyFieldEditor implements OnInit {
  protected mode = signal<'add' | 'edit' | 'code'>('add');

  private selection = inject(SelectionManager<FormlyFieldConfig>);
  private snackBar = inject(MatSnackBar);
  private field: FormlyFieldConfig | null = null;
  private readonly editChild = viewChild.required(FormlyFieldEditorEdit);
  private readonly codeChild = viewChild.required(FormlyFieldEditorCode);

  ngOnInit(): void {
    this.selection.onSelect.subscribe((field) => {
      this.field = field;
      if (field === null) {
        this.mode.set('add');
      } else if (this.mode() === 'add') {
        this.mode.set('edit');
      }
    });
  }

  save() {
    this.mode() === 'edit' && this.editChild().save();
    this.mode() === 'code' && this.codeChild().save();
  }

  protected setMode(mode: 'add' | 'edit' | 'code'): void {
    if (this.field === null && (mode === 'edit' || mode === 'code')) {
      this.snackBar.open('Select a field to edit', 'X');
      return;
    }
    if (mode === 'edit' || mode === 'code') {
      this.save();
    }
    this.mode.set(mode);
  }
}
