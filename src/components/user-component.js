import config from "../config";
import Component from "../core/ecs-engine/component";

export default class UserComponent extends Component {
    constructor() {
        super();
        this.name = config.defaultUserName;
    }
    /** @param {UserComponent} options */
    setup(options) { return super.setup(options); }
}
