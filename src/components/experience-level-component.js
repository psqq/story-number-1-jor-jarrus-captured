import Component from "../core/ecs-engine/component";

export default class ExperienceLevelComponent extends Component {
    constructor() {
        super();
        this.level = 0;
        this.currentExperience = 0;
        this.currentLevelExperience = 0;
        this.nextLevelExperience = 0;
    }
    /** @param {ExperienceLevelComponent} options */
    setup(options) { return super.setup(options); }
}
