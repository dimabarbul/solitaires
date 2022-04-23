export interface ICommand {
    execute(): void
    undo(): void
}

export class Command implements ICommand {
    public constructor(
        private readonly executeAction: () => void,
        private readonly undoAction: () => void
    ) {
    }

    public execute(): void {
        this.executeAction();
    }

    public undo(): void {
        this.undoAction();
    }
}
