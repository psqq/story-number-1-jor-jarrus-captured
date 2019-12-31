import Component from "../core/ecs-engine/component";

export default class DamageComponent extends Component {
    constructor() {
        super();
        this.sourceId = 0;
        this.targetId = 0;
        this.physicalDamage = 0;
        this.magicDamage = 0;
        this.trueDamage = 0;
    }
    /** @param {AutoAttackComponent} options */
    setup(options) { return super.setup(options); }
}
