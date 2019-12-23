import Component from "../../core/component";

interface TeamComponentInterface {
    teamName?: string;
}

export default class TeamComponent
    extends Component
    implements TeamComponentInterface {

    teamName?: string;

    constructor() {
        super();
    }

    setup(options: TeamComponentInterface) {
        this.teamName = options.teamName;
        return this;
    }

}
