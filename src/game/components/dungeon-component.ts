import Component from "../../core/component";

export default class DungeonComponent extends Component {
    map: string[][];
    constructor() {
        super();
    }
    setMap(map: string[][]) {
        this.map = map;
        return this;
    }
}
