import Component from "../../core/component";

interface HealthPointsComponentInterface {
    currentHealthPoints?: number;
    baseHealthPoints?: number;
    bonusHealthPoints?: number;
    maxHealthPoints?: number;
    enhancerHealthPointsPerLevel?: number;
}

export default class HealthPointsComponent
    extends Component
    implements HealthPointsComponentInterface {

    currentHealthPoints?: number;
    baseHealthPoints?: number;
    bonusHealthPoints?: number;
    maxHealthPoints?: number;
    enhancerHealthPointsPerLevel?: number;

    constructor() {
        super();
    }

    setup(options: HealthPointsComponentInterface) {
        this.currentHealthPoints = options.currentHealthPoints;
        this.baseHealthPoints = options.baseHealthPoints;
        this.bonusHealthPoints = options.bonusHealthPoints;
        this.maxHealthPoints = options.maxHealthPoints;
        this.enhancerHealthPointsPerLevel = options.enhancerHealthPointsPerLevel;
        return this;
    }

}
