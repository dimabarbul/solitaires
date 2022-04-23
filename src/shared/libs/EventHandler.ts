export default class EventHandler<T> {

    private readonly listeners: ((event: T) => void)[] = [];

    public subscribe(listener: (event: T) => void): void {
        this.listeners.push(listener);
    }

    public unsubscribe(listener: (event: T) => void): void {
        const index = this.listeners.indexOf(listener);

        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    public trigger(event: T): void {
        this.listeners.forEach(listener => listener(event));
    }

}
