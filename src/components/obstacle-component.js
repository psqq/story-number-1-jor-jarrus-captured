import Component from "../core/ecs-engine/component";

export default class ObstacleComponent extends Component {
    constructor() {
        super();
        this.teamName = null;
    }
    /** @param {ObstacleComponent} options */
    setup(options) { return super.setup(options); }
}
