import Component from "../../core/component";

interface ExperienceLevelComponentInterface {
    level?: number;
    currentExperience?: number;
    currentLevelExperience?: number;
    nextLevelExperience?: number;
}

export default class ExperienceLevelComponent
    extends Component
    implements ExperienceLevelComponentInterface {

    level?: number;
    currentExperience?: number;
    currentLevelExperience?: number;
    nextLevelExperience?: number;

    constructor() {
        super();
    }

    setup(options: ExperienceLevelComponentInterface) {
        this.level = options.level;
        this.currentExperience = options.currentExperience;
        this.currentLevelExperience = options.currentExperience;
        this.nextLevelExperience = options.nextLevelExperience;
        return this;
    }

}
