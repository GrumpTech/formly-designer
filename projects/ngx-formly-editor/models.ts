export class EditCommand {
  constructor(
    public commandType: EditCommandType,
    public data?: string,
  ) {}
}

export enum EditCommandType {
  EditUndo,
  EditRedo,
  EditCut,
  EditCopy,
  EditPaste,
  EditDelete,
  EditSelectAll,
}
