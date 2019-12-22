import Component from "../../core/component";

export default class MemorizedFovAreaComponent extends Component {
    memorizedFovArea: boolean[][];
    deep: number;
    constructor() {
        super();
    }
    setMemorizedFovArea(memorizedFovArea: boolean[][]) {
        this.memorizedFovArea = memorizedFovArea;
        return this;
    }
    setDeep(deep: number) {
        this.deep = deep;
        return this;
    }
}
