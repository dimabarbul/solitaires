import EventHandler from './EventHandler';
import { ICommand } from './Commands';

export default class History {
    public readonly onHistoryChanged: EventHandler<void> = new EventHandler<void>();

    private readonly _commands: ICommand[] = [];
    private _currentIndex: number = -1;

    public clear(): void {
        this._commands.length = 0;
        this._currentIndex = -1;

        this.onHistoryChanged.trigger();
    }

    public pushCommand(command: ICommand): void {
        if (this._currentIndex < this._commands.length - 1) {
            this._commands.length = this._currentIndex + 1;
        }

        this._commands.push(command);
        this._currentIndex++;

        this.onHistoryChanged.trigger();
    }

    public moveBack(): ICommand {
        if (!this.canMoveBack()) {
            throw new Error('No more commands to move back');
        }

        const command = this._commands[this._currentIndex--];

        this.onHistoryChanged.trigger();

        return command;
    }

    public moveForward(): ICommand {
        if (!this.canMoveForward()) {
            throw new Error('No more commands to move forward');
        }

        const command = this._commands[++this._currentIndex];

        this.onHistoryChanged.trigger();

        return command;
    }

    public canMoveBack(): boolean {
        return this._currentIndex >= 0;
    }

    public canMoveForward(): boolean {
        return this._currentIndex < this._commands.length - 1;
    }
}
