import Engine from "./engine";
import EventEmitter from "wolfy87-eventemitter";
import coreConfig from "./core-config";

interface DeltaTimeForNextState {
    amountOfTime: 0,
    isChanges: false 
};

export default class System extends EventEmitter {
    private priority: number = 0;
    private engine: Engine;
    /**
     * Init system
     * @param engine 
     */
    constructor(engine?: Engine, priority: number = 0) {
        super();
        this.engine = engine;
        this.priority = priority;
    }
    /**
     * Sets priority of system
     * @param priority priority
     */
    setPriority(priority: number): System {
        const oldPriority = this.priority;
        this.priority = priority;
        if (oldPriority !== priority) {
            this.emit(coreConfig.systemEvents.priorityChanged);
        }
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
