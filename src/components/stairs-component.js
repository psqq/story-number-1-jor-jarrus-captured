import Component from "../core/ecs-engine/component";

export default class StairsComponent extends Component {
    constructor() {
        super();
        this.toDeep = 0;
    }
    /** @param {StairsComponent} options */
    setup(options) { return super.setup(options); }
}
