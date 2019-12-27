import Component from "../core/ecs-engine/component";

export default class SimpleAiComponent extends Component {
    constructor() {
        super();
        /** @type {{x:number, y:number}} */
        this.target = { x: null, y: null };
    }
}
