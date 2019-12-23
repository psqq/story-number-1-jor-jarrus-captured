import Component from "../../core/component";

interface PhysicalDamageComponentInterface {
    currentPhysicalDamage?: number;
    basePhysicalDamage?: number;
    bonusPhysicalDamage?: number;
    maxPhysicalDamage?: number;
    enhancerPhysicalDamagePerLevel?: number;
}

export default class PhysicalDamageComponent
    extends Component
    implements PhysicalDamageComponentInterface {

    currentPhysicalDamage?: number;
    basePhysicalDamage?: number;
    bonusPhysicalDamage?: number;
    maxPhysicalDamage?: number;
    enhancerPhysicalDamagePerLevel?: number;

    constructor() {
        super();
    }

    setup(options: PhysicalDamageComponentInterface) {
        this.currentPhysicalDamage = options.currentPhysicalDamage;
        this.basePhysicalDamage = options.basePhysicalDamage;
        this.bonusPhysicalDamage = options.bonusPhysicalDamage;
        this.maxPhysicalDamage = options.maxPhysicalDamage;
        this.enhancerPhysicalDamagePerLevel = options.enhancerPhysicalDamagePerLevel;
        return this;
    }

}
