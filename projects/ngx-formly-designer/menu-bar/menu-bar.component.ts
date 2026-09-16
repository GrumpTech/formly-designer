import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuBarItem, MenuItem } from '@grumptech/ngx-matx/menu-bar';
import { FileCommand, FileCommandType } from '@grumptech/ngx-matx/editor-app';
import { MatxMenuBar } from '@grumptech/ngx-matx/menu-bar';
import { EditCommand, EditCommandType } from '@grumptech/ngx-formly-editor';

@Component({
  selector: 'formly-designer-menu-bar',
  templateUrl: 'menu-bar.component.html',
  host: {
    '(window:paste)': 'handlePaste($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatxMenuBar],
})
export class FormlyDesignerMenuBar implements OnInit {
  readonly importers = input<string[]>([]);
  readonly exporters = input<string[]>([]);
  readonly commandReceived = output<FileCommand | EditCommand>();

  protected menuBar: MenuBarItem<FileCommand | EditCommand>[] = [
    {
      text: 'File',
      children: [
        {
          text: 'New',
          icon: 'note_add',
          shortcuts: [{ ctrl: true, alt: true, keyCode: 'KeyN' }],
          data: new FileCommand(FileCommandType.FileNew),
        },
        {
          text: 'Save',
          icon: 'save',
          shortcuts: [{ ctrl: true, keyCode: 'KeyS' }],
          data: new FileCommand(FileCommandType.FileSave),
        },
        {
          text: 'Save as...',
          icon: 'save_as',
          shortcuts: [{ ctrl: true, alt: true, keyCode: 'KeyS' }],
          data: new FileCommand(FileCommandType.FileSaveAs),
        },
        {
          text: 'Save all',
          icon: '',
          shortcuts: [{ ctrl: true, shift: true, keyCode: 'KeyS' }],
          data: new FileCommand(FileCommandType.FileSaveAll),
        },
        {
          text: 'Rename',
          icon: 'edit',
          shortcuts: [{ ctrl: true, keyCode: 'KeyR' }],
          data: new FileCommand(FileCommandType.FileRename),
        },
        {
          text: 'Delete',
          icon: 'delete',
          shortcuts: [{ ctrl: true, keyCode: 'Delete' }],
          data: new FileCommand(FileCommandType.FileDelete),
        },
        {
          text: 'Close',
          icon: 'close',
          shortcuts: [{ ctrl: true, keyCode: 'KeyQ' }],
          data: new FileCommand(FileCommandType.FileClose),
        },
        {
          text: 'Close all',
          icon: '',
          shortcuts: [{ ctrl: true, shift: true, keyCode: 'KeyQ' }],
          data: new FileCommand(FileCommandType.FileCloseAll),
        },
      ],
    },
    {
      text: 'Edit',
      children: [
        {
          text: 'Undo',
          icon: 'undo',
          shortcuts: [{ ctrl: true, keyCode: 'KeyZ' }],
          data: new EditCommand(EditCommandType.EditUndo),
        },
        {
          text: 'Redo',
          icon: 'redo',
          shortcuts: [
            { ctrl: true, shift: true, keyCode: 'KeyZ' },
            { ctrl: true, keyCode: 'KeyY', hideMenuText: true },
          ],
          data: new EditCommand(EditCommandType.EditRedo),
        },
        {
          text: 'Cut',
          icon: 'content_cut',
          shortcuts: [{ ctrl: true, keyCode: 'KeyX' }],
          data: new EditCommand(EditCommandType.EditCut),
        },
        {
          text: 'Copy',
          icon: 'content_copy',
          shortcuts: [{ ctrl: true, keyCode: 'KeyC' }],
          data: new EditCommand(EditCommandType.EditCopy),
        },
        {
          text: 'Paste',
          icon: 'content_paste',
          shortcuts: [{ ctrl: true, keyCode: 'KeyV', disabled: true }],
          data: new EditCommand(EditCommandType.EditPaste),
        },
        {
          text: 'Delete',
          icon: 'delete',
          shortcuts: [{ keyCode: 'Delete' }],
          data: new EditCommand(EditCommandType.EditDelete),
        },
        {
          text: 'Select all',
          icon: 'select_all',
          shortcuts: [{ ctrl: true, keyCode: 'KeyA' }],
          data: new EditCommand(EditCommandType.EditSelectAll),
        },
      ],
    },
  ];
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    const importers = this.importers();
    if (importers.length) {
      this.menuBar[0].children.push({
        text: 'Import',
        icon: 'file_upload',
        data: new FileCommand(FileCommandType.FileImport),
        children:
          importers.length > 1
            ? importers.map((i) => ({
                text: i,
                data: new FileCommand(FileCommandType.FileImport, i),
              }))
            : [],
      });
    }
    const exporters = this.exporters();
    if (exporters.length) {
      this.menuBar[0].children.push({
        text: 'Export',
        icon: 'file_download',
        data: new FileCommand(FileCommandType.FileExport),
        children:
          exporters.length > 1
            ? exporters.map((i) => ({
                text: i,
                data: new FileCommand(FileCommandType.FileExport, i),
              }))
            : [],
      });
    }
  }

  protected handleClick(item: MenuItem<FileCommand | EditCommand>) {
    if (
      item.data instanceof EditCommand &&
      item.data.commandType === EditCommandType.EditPaste
    ) {
      this.snackBar.open(
        "Use Ctrl + V, browsers don't support clipboard access.",
        'X',
      );
    } else {
      this.commandReceived.emit(item.data);
    }
  }

  protected handlePaste(event: ClipboardEvent) {
    if (!(event.target as Element)?.closest('input,textarea')) {
      this.commandReceived.emit(
        new EditCommand(
          EditCommandType.EditPaste,
          event.clipboardData?.getData('text/plain'),
        ),
      );
    }
  }
}
