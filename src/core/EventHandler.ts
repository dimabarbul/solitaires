import Event from './Event';

export default class EventHandler<T extends Event> {

    private readonly _listeners: ((event: T) => void)[] = [];

    public subscribe(listener: (event: T) => void): void {
        this._listeners.push(listener);
    }

    public unsubscribe(listener: (event: T) => void): void {
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    }

    public trigger(event: T): void {
        this._listeners.forEach(listener => listener(event));
    }

}
