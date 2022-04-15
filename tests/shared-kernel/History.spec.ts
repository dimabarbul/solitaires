import * as assert from 'assert';
import History from '../../src/shared-kernel/History';
import ICommand from '../../src/shared-kernel/ICommand';

const command1: ICommand = {
    execute: () => {},
    undo: () => {},
};
const command2: ICommand = {
    execute: () => {},
    undo: () => {},
};
const command3: ICommand = {
    execute: () => {},
    undo: () => {},
};

describe('history', () => {
    describe('move back', () => {
        it('cannot move if there is no history', () => {
            const history = new History();

            const canMove = history.canMoveBack();

            assert.equal(canMove, false);
        });
        it('can move one step', () => {
            const history: History = new History();
            history.pushCommand(command1);

            const poppedCommand: ICommand = history.moveBack();

            assert.equal(poppedCommand, command1);
        });
        it('can move multiple steps', () => {
            const history: History = new History();
            history.pushCommand(command1);
            history.pushCommand(command2);
            history.pushCommand(command3);

            history.moveBack();
            history.moveBack();
            const poppedCommand: ICommand = history.moveBack();

            assert.equal(poppedCommand, command1);
        });
        it('cannot move beyond', () => {
            const history: History = new History();
            history.pushCommand(command1);
            history.pushCommand(command2);
            history.pushCommand(command3);

            history.moveBack();
            history.moveBack();
            history.moveBack();
            const canMove: boolean = history.canMoveBack();

            assert.equal(canMove, false);
        });
        it('can move after push', () => {
            const history: History = new History();
            history.pushCommand(command1);

            history.moveBack();
            history.pushCommand(command2);
            const poppedCommand: ICommand = history.moveBack();

            assert.equal(poppedCommand, command2);
        });
        it('can move after moving forward', () => {
            const history: History = new History();
            history.pushCommand(command1);
            history.pushCommand(command2);

            history.moveBack();
            history.moveForward();
            history.moveBack();
            const poppedCommand: ICommand = history.moveBack();

            assert.equal(poppedCommand, command1);
        });
        it('cannot move after clear', () => {
            const history: History = new History();
            history.pushCommand(command1);
            history.pushCommand(command2);
            history.pushCommand(command3);

            history.clear();
            const canMove: boolean = history.canMoveBack();

            assert.equal(canMove, false);
        });
    });
    describe('move forward', () => {
        it('cannot move if there is no history', () => {
            const history: History = new History();

            const canMove: boolean = history.canMoveForward();

            assert.equal(canMove, false);
        });
        it('can move one step', () => {
            const history: History = new History();
            history.pushCommand(command1);
            history.moveBack();

            const poppedCommand: ICommand = history.moveForward();

            assert.equal(poppedCommand, command1);
        });
        it('can move multiple steps', () => {
            const history: History = new History();
            history.pushCommand(command1);
            history.pushCommand(command2);
            history.pushCommand(command3);
            history.moveBack();
            history.moveBack();
            history.moveBack();

            history.moveForward();
            history.moveForward();
            const poppedCommand: ICommand = history.moveForward();

            assert.equal(poppedCommand, command3);
        });
        it('cannot move after push', () => {
            const history: History = new History();
            history.pushCommand(command1);

            history.moveBack();
            history.pushCommand(command2);
            const canMove: boolean = history.canMoveForward();

            assert.equal(canMove, false);
        });
        it('cannot move after clear', () => {
            const history: History = new History();
            history.pushCommand(command1);
            history.pushCommand(command2);
            history.pushCommand(command3);

            history.clear();
            const canMove: boolean = history.canMoveForward();

            assert.equal(canMove, false);
        });
    });
    describe('on-history-changed event', () => {
        it('triggered when pushing', () => {
            const history: History = new History();

            let triggered: boolean = false;
            history.onHistoryChanged.subscribe((): void => {
                triggered = true;
            });

            history.pushCommand(command1);

            assert.equal(triggered, true);
        });
        it('triggered when pushing when there is history', () => {
            const history: History = new History();
            history.pushCommand(command1);

            let triggeredCount: number = 0;
            history.onHistoryChanged.subscribe((): void => {
                triggeredCount++
            });

            history.pushCommand(command2);
            history.pushCommand(command3);

            assert.equal(triggeredCount, 2);
        });
        it('triggered when moving back', () => {
            const history: History = new History();
            history.pushCommand(command1);

            let triggered: boolean = false;
            history.onHistoryChanged.subscribe((): void => {
                triggered = true;
            });

            history.moveBack();

            assert.equal(triggered, true);
        });
        it('triggered when moving forward', () => {
            const history: History = new History();
            history.pushCommand(command1);
            history.moveBack();

            let triggered: boolean = false;
            history.onHistoryChanged.subscribe((): void => {
                triggered = true;
            });

            history.moveForward();

            assert.equal(triggered, true);
        });
        it('triggered when clearing', () => {
            const history: History = new History();
            history.pushCommand(command1);

            let triggered: boolean = false;
            history.onHistoryChanged.subscribe((): void => {
                triggered = true;
            });

            history.clear();

            assert.equal(triggered, true);
        });
        it('triggered when clearing and there was no commands', () => {
            const history: History = new History();

            let triggered: boolean = false;
            history.onHistoryChanged.subscribe((): void => {
                triggered = true;
            });

            history.clear();

            assert.equal(triggered, true);
        });
    });
});
