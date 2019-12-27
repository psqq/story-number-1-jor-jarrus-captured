
export default class Component {
    constructor() { }
    erase() {
        for (let key in this) {
            this[key] = null;
        }
    }
    /** @param {Component} options */
    setup(options) { return Object.assign(this, options); }
}
