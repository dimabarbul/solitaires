export default class CardMovedEvent {
    public constructor(
        public readonly cardId: number,
        public readonly fromStackId: number,
        public readonly toStackId: number
    ) {
    }
}