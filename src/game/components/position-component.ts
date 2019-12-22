import Component from "../../core/component";
import Victor = require("victor");

export default class PositionComponent extends Component {
    x: number;
    y: number;
    deep: number;
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
    setDeep(deep: number) {
        this.deep = deep;
        return this;
    }
    toVictor(): Victor {
        return new Victor(this.x, this.y);
    }
}
