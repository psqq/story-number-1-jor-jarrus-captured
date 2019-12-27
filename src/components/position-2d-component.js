import Component from "../core/ecs-engine/component";

export default class Position2DComponent extends Component {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
    /** @param {Position2DComponent} options */
    setup(options) { return super.setup(options); }
}
