import Component from "../../core/component";
import config from '../../config';

export default class PositionComponent extends Component {
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
}
