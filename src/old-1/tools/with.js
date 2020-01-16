
/**
 * @template T
 */
export default class With {
    /**
     * @param {T} obj 
     */
    constructor(obj) {
        this.obj = obj;
    }
    /**
     * @param {(obj: T) => any} cb 
     */
    do(cb) {
        cb(this.obj);
        return this;
    }
    finish() {
        return this.obj;
    }
}
