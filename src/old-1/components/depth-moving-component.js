import Component from "../core/ecs-engine/component";

export default class DepthMovingComponent extends Component {
    constructor() {
        super();
        /** @type {number} */
        this.toDeep = null;
    }
    /** @param {DepthMovingComponent} options */
    setup(options) { return super.setup(options); }
}
