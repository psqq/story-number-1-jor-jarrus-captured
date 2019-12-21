import Component from "../../core/component";

export default class DungeonComponent extends Component {
    map: Map<string, string>;
    constructor(map: Map<string, string>) {
        super();
        this.map = map || new Map();
    }
}
