import Engine from "./engine";

interface DeltaTimeForNextState {
    amountOfTime: 0,
    isChanges: false 
};

export default class System {
    private priority: number = 0;
    private engine: Engine;
    /**
     * Init system
     * @param engine 
     */
    init(engine: Engine, priority: number = 0) {
        this.engine = engine;
        this.priority = priority;
    }
    /**
     * Sets priority of system
     * @param priority priority
     */
    setPriority(priority: number): System {
        this.priority = priority;
        return this;
    }
    /**
     * Gets priority of system
     */
    getPriority(): number {
        return this.priority;
    }
    /**
     * Clear system
     */
    clear() {
        this.engine = null;
        this.priority = 0;
    }
    /**
     * Updates the system for the specified amount of time.
     * @param deltaTime system update time
     */
    update(deltaTime: number = 0) { }
    /**
     * Returns the time after which the system changes the state of the engine.
     */
    getDeltaTimeForNextState(): DeltaTimeForNextState {
        return { amountOfTime: 0, isChanges: false };
    }
}
