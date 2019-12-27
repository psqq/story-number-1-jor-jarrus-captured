import Component from "../core/ecs-engine/component";

export default class PhysicalDamageComponent extends Component {
    constructor() {
        super();
        this.currentPhysicalDamage = 0;
        this.basePhysicalDamage = 0;
        this.bonusPhysicalDamage = 0;
        this.totalPhysicalDamage = 0;
        this.physicalDamagePerLevel = 0;
    }
    /** @param {PhysicalDamageComponent} options */
    setup(options) { return super.setup(options); }
}
