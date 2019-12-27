import Component from "../core/ecs-engine/component";

export default class HealthPointsComponent extends Component {
    constructor() {
        super();
        this.currentHealthPoints = 0;
        this.baseHealthPoints = 0;
        this.bonusHealthPoints = 0;
        this.totalHealthPoints = 0;
        this.healthPointsPerLevel = 0;
    }
    /** @param {HealthPointsComponent} options */
    setup(options) { return super.setup(options); }
}
