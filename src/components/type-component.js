import Component from "../core/ecs-engine/component";

export default class TypeComponent extends Component {
    constructor() {
        super();
        this.typeName = '';
    }
    /** @param {TypeComponent} options */
    setup(options) { return super.setup(options); }
}
