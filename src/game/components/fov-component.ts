import Component from "../../core/component";

export default class FovComponent extends Component {
    fov: boolean[][];
    constructor() {
        super();
    }
    setFov(fov: boolean[][]) {
        this.fov = fov;
        return this;
    }
}
