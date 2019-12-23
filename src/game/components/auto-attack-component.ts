import Component from "../../core/component";

interface AutoAttackComponentInterface {
    attackingId?: number;
    protectingId?: number;
}

export default class AutoAttackComponent
    extends Component
    implements AutoAttackComponentInterface {

    attackingId?: number;
    protectingId?: number;

    constructor() {
        super();
    }

    setup(options: AutoAttackComponentInterface) {
        this.attackingId = options.attackingId;
        this.protectingId = options.protectingId;
        return this;
    }

}
