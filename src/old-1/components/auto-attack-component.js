import Component from "../core/ecs-engine/component";

export default class AutoAttackComponent extends Component {
    constructor() {
        super();
        this.targetId = 0;
    }
    /** @param {AutoAttackComponent} options */
    setup(options) { return super.setup(options); }
}
