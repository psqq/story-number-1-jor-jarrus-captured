import Engine from "./engine";

export default class System {
    /**
     * @param {Engine} engine 
     * @param {number} priority 
     */
    constructor(engine = null, priority = null) {
        this.engine = engine;
        this.priority = priority;
    }
    /**
     * Destructor
     */
    erase() {}
    /** @param {System} options */
    setup(options) {
        Object.assign(this, options);
        return this;
    }
    /**
     * @param {number} dt 
     */
    update(dt = 0) { }
}
