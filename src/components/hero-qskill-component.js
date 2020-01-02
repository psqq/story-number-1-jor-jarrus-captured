import Component from "../core/ecs-engine/component";

export default class HeroQSkillComponent extends Component {
    constructor() {
        super();
        this.level = 0;
        this.duration = 0;
        this.damage = 0;
        this.damageReduction = 0;
        this.coolDown = 0;
    }
}
