import Component from "../../core/component";
import Victor = require("victor");

export default class MoveDirectionComponent extends Component {
    x: number;
    y: number;
    depthChange: number;
    constructor() {
        super();
    }
    clear() {
        this.x = null;
        this.y = null;
        this.depthChange = null;
        return this;
    }
    setX(x: number) {
        this.x = x;
        return this;
    }
    setY(y: number) {
        this.y = y;
        return this;
    }
    setDepthChange(depthChange: number) {
        this.depthChange = depthChange;
        return this;
    }
    toVictor(): Victor {
        return new Victor(this.x, this.y);
    }
}
