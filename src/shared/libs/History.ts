import EventHandler from './EventHandler';
import { ICommand } from './Commands';

export default class History {
    public readonly onHistoryChanged: EventHandler<void> = new EventHandler<void>();

    private readonly commands: ICommand[] = [];
    private currentIndex: number = -1;

    public clear(): void {
        this.commands.length = 0;
        this.currentIndex = -1;

        this.onHistoryChanged.trigger();
    }

    public pushCommand(command: ICommand): void {
        if (this.currentIndex < this.commands.length - 1) {
            this.commands.length = this.currentIndex + 1;
        }

        this.commands.push(command);
        this.currentIndex++;

        this.onHistoryChanged.trigger();
    }

    public moveBack(): ICommand {
        if (!this.canMoveBack()) {
            throw new Error('No more commands to move back');
        }

        const command = this.commands[this.currentIndex--];

        this.onHistoryChanged.trigger();

        return command;
    }

    public moveForward(): ICommand {
        if (!this.canMoveForward()) {
            throw new Error('No more commands to move forward');
        }

        const command = this.commands[++this.currentIndex];

        this.onHistoryChanged.trigger();

        return command;
    }

    public canMoveBack(): boolean {
        return this.currentIndex >= 0;
    }

    public canMoveForward(): boolean {
        return this.currentIndex < this.commands.length - 1;
    }
}
