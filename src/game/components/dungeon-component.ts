import Component from "../../core/component";

export default class DungeonComponent extends Component {
    map: string[][];
    deep: number;
    constructor() {
        super();
    }
    setMap(map: string[][]) {
        this.map = map;
        return this;
    }
    setDeep(deep: number) {
        this.deep = deep;
        return this;
    }
}
