export class Point {
    public constructor(
        private readonly _x: number,
        private readonly _y: number
    ) {
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }
}

export class Point3D {
    public constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly z: number
    ) {
    }
}
