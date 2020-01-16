import Component from "../core/ecs-engine/component";

export default class FovComponent extends Component {
    constructor() {
        super();
        /** @type {boolean[][]} */
        this.fov = null;
    }
    /** @param {FovComponent} options */
    setup(options) { return super.setup(options); }
}
