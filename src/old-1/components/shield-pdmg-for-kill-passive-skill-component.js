import Component from "../core/ecs-engine/component";

export default class ShieldPDmgForKillPassiveSkillComponent extends Component {
    constructor() {
        super();
        this.shieldForKill = 0;
        this.shield = 0;
        this.pDmgForKill = 0;
        this.pDmg = 0;
        this.duration = 0;
    }
    /** @param {ShieldPDmgForKillPassiveSkillComponent} options */
    setup(options) { return super.setup(options); }
}
