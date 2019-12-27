import Component from "../core/ecs-engine/component";

export default class MemorizedFovAreaComponent extends Component {
    constructor() {
        super();
        /** @type {boolean[][]} */
        this.memorizedFovArea = null;
        this.deep = 0;
    }
    /** @param {MemorizedFovAreaComponent} options */
    setup(options) { return super.setup(options); }
}
