
export default class Component {
    constructor() { }
    erase() {
        for (let key in this) {
            this[key] = null;
        }
    }
    /** @param {Component} options */
    setup(options) { return Object.assign(this, options); }
    isInitialized() {
        for (let key in this) {
            if (this[key] == null) {
                return false;
            }
        }
        return true;
    }
}
