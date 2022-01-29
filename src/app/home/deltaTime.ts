export class DeltaTime {
    private lastTick: number;
    private static instance: DeltaTime;
    private deltaTime: number;

    private constructor() {
        this.lastTick = Date.now();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new DeltaTime();
        }
        return this.instance;
    }

    public updateDeltaTime() {
        const time = Date.now();
        this.deltaTime = time - this.lastTick;
        this.lastTick = time;
    }

    public getDeltaTime(): number {
        return this.deltaTime;
    }

}