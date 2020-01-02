import Component from "./component";

export default class EnabledComponent extends Component {
    constructor() {
        super();
        /** @type {boolean} */
        this.enabled = true;
    }
}
