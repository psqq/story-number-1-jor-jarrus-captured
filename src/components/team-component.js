import Component from "../core/ecs-engine/component";

export default class TeamComponent extends Component {
    constructor() {
        super();
        this.teamName = '';
    }
    /** @param {TeamComponent} options */
    setup(options) { return super.setup(options); }
}
