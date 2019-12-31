import Component from "../core/ecs-engine/component";

export default class ShieldComponent extends Component {
    constructor() {
        super();
        this.shield = 0;
    }
    /** @param {ShieldComponent} options */
    setup(options) { return super.setup(options); }
}
