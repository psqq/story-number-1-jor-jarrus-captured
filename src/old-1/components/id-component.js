import Component from "../core/ecs-engine/component";

export default class IdComponent extends Component {
    constructor() {
        super();
        this.id = 0;
    }
    /** @param {IdComponent} options */
    setup(options) { return super.setup(options); }
}
