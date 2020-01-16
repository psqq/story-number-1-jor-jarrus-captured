import Component from "../core/ecs-engine/component";

export default class CharacteristicsComponent extends Component {
    constructor() {
        super();
        const statOptions = {
            current: 0,
            base: 0,
            bonus: 0,
            total: 0,
            perLevel: 0,
        };
        this.healthPoints = Object.assign({}, statOptions);
        this.magicPoints = Object.assign({}, statOptions);
        this.physicalDamage = Object.assign({}, statOptions);
        this.magicDamage = Object.assign({}, statOptions);
        this.physicalArmor = Object.assign({}, statOptions);
        this.magicArmor = Object.assign({}, statOptions);
        this.criticalChance = Object.assign({}, statOptions);
    }
}
