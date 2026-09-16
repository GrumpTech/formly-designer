import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, skip } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  viewChild,
  inject,
  DestroyRef,
  output,
} from '@angular/core';
import {
  jsonParseFieldsAndValidate,
  jsonStringify,
  toFlatArray,
} from '@grumptech/formly-converters';
import { TestValueManager } from '../../services/test-value-manager';
import { DataManager } from '../../services/data-manager';
import { UndoManager } from '../../services/undo-manager';
import { SelectionManager } from '../../services/selection-manager';
import { ResultComponent } from '../result/result.component';
import { FormlyFieldEditor } from '../field-editor/field-editor.component';
import { TestValueComponent } from '../test-value/test-value.component';
import { EditCommand, EditCommandType } from '../../models';
import { FormEditorMode } from '../../modes';

@Component({
  selector: 'formly-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  providers: [SelectionManager, DataManager, TestValueManager, UndoManager],
  host: {
    '[class.hidden]': 'hidden()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormlyFieldEditor, ResultComponent, TestValueComponent],
})
export class FormlyEditor implements OnInit {
  readonly hidden = input(false);
  readonly fields = input<FormlyFieldConfig[]>([]);
  readonly onCommand = input<Observable<EditCommand>>();
  readonly dataChange = output();

  protected readonly fieldEditor = viewChild.required(FormlyFieldEditor);
  protected mode: FormEditorMode = 'select';

  private snackBar = inject(MatSnackBar);
  private dataManager = inject(DataManager);
  private undoManager = inject(UndoManager<FormlyFieldConfig[]>);
  private selection = inject(SelectionManager<FormlyFieldConfig>);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.onCommand()
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((i) => this.handleCommand(i));
    this.dataManager.setFields(this.fields());
    this.dataManager.onChange
      .pipe(skip(1))
      .subscribe(() => this.dataChange.emit());
  }

  handleModeChange(mode: FormEditorMode): void {
    this.mode = mode;
  }

  private handleCommand(command: EditCommand): void {
    if (this.hidden()) {
      return;
    }
    this.fieldEditor().save();
    switch (command.commandType) {
      case EditCommandType.EditUndo:
        this.undoManager.undo();
        break;
      case EditCommandType.EditRedo:
        this.undoManager.redo();
        break;
      case EditCommandType.EditCut:
        navigator.clipboard.writeText(this.getSelectedFieldsJson());
        this.dataManager.removeSelectedFields();
        break;
      case EditCommandType.EditCopy:
        navigator.clipboard.writeText(this.getSelectedFieldsJson());
        break;
      case EditCommandType.EditPaste:
        const convertedData = jsonParseFieldsAndValidate(command.data ?? '');
        if (convertedData.success) {
          this.dataManager.addFields(convertedData.result);
        } else {
          console.warn(convertedData.message, { data: command.data });
          this.snackBar.open('Clipboard contains invalid data', 'X');
        }
        break;
      case EditCommandType.EditDelete:
        this.dataManager.removeSelectedFields();
        break;
      case EditCommandType.EditSelectAll:
        this.selection.set(toFlatArray(this.dataManager.getFields()));
        break;
    }
  }

  private getSelectedFieldsJson(): string {
    return jsonStringify(this.dataManager.getSelectedFields());
  }
}
