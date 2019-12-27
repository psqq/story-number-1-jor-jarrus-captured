import Component from "../core/ecs-engine/component";

export default class DungeonComponent extends Component {
    constructor() {
        super();
        /** @type {string[][]} */
        this.map = null;
    }
    /** @param {DungeonComponent} options */
    setup(options) { return super.setup(options); }
}
