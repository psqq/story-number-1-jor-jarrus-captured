import Component from "../core/ecs-engine/component";

export default class TextComponent extends Component {
    constructor() {
        super();
        this.text = "";
    }
    /** @param {TextComponent} options */
    setup(options) { return super.setup(options); }
}
