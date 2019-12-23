import Component from "../../core/component";

interface IdComponentInterface {
    id?: number;
}

export default class IdComponent
    extends Component
    implements IdComponentInterface {

    id?: number;

    constructor() {
        super();
    }

    setup(options: IdComponentInterface) {
        this.id = options.id;
        return this;
    }

}
