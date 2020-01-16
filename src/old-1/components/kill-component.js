import Component from "../core/ecs-engine/component";

export default class KillComponent extends Component {
    constructor() {
        super();
        this.killerId = 0;
        this.killedId = 0;
    }
    /** @param {KillComponent} options */
    setup(options) { return super.setup(options); }
}
