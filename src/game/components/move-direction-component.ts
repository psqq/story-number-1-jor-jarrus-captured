import Component from "../../core/component";
import Victor = require("victor");

export default class MoveDirectionComponent extends Component {
    x: number = 0;
    y: number = 0;
    constructor() {
        super();
    }
    setX(x: number) {
        this.x = x;
        return this;
    }
    setY(y: number) {
        this.y = y;
        return this;
    }
    toVictor(): Victor {
        return new Victor(this.x, this.y);
    }
}
