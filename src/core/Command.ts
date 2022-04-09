import ICommand from './ICommand';

export default class Command implements ICommand {
    public constructor(
        private readonly _executeAction: () => void,
        private readonly _undoAction: () => void
    ) {
    }

    public execute(): void {
        this._executeAction();
    }

    public undo(): void {
        this._undoAction();
    }
}