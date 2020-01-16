
class Damage {
    constructor() {
        this.physical = 0;
        this.magic = 0;
    }
    getTotal() {
        return this.physical + this.magic;
    }
}

export default class BaseSystem extends System {
    constructor() {
    }
}
