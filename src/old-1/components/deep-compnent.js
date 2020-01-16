import Component from "../core/ecs-engine/component";

export default class DeepComponent extends Component {
    constructor() {
        super();
        /** @type {number} */
        this.deep = null;
    }
    /** @param {DeepComponent} options */
    setup(options) { return super.setup(options); }
}
