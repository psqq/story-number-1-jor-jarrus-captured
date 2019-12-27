import Component from "../core/ecs-engine/component";

export default class GlyphComponent extends Component {
    constructor() {
        super();
        this.symbol = '';
        this.fgColor = '';
        this.bgColor = '';
        this.zLevel = 0;
    }
    /** @param {GlyphComponent} options */
    setup(options) { return super.setup(options); }
}
