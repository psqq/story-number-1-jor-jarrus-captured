import Component from "../../core/component";

export default class StairsComponent extends Component {
    depthChange: number;
    constructor() {
        super();
    }
    setDepthChange(depthChange: number) {
        this.depthChange = depthChange;
        return this;
    }
}
