import Engine from "./engine";

// TODO
export default class SystemGrouper extends System {
    constructor() {
        /** @type {Engine} */
        this.engine = null;
        /** @type {number} */
        this.priority = 0;
    }
    /** @param {SystemGrouper} options */
    setup(options) { return Object.assign(this, options); }
    /**
     * @param {number} dt 
     */
    update(dt = 0) { }
}
