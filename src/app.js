import { Display } from "rot-js";
import config from "./config";
import Game from "./game";
import messages from "./messages";
import moment from "moment";

export default class App {
    constructor() {
        this.display = new Display(config.rotjsDisplayOptions);
        this.userName = config.defaultUserName;
        this.game = new Game(this);
    }
    async load() { }
    /**
     * @param {string} locale 
     */
    setLocale(locale) {
        if (!locale) {
            return;
        }
        localStorage.setItem('locale', locale);
        messages.setLocale(locale);
    }
    restoreLocale() {
        const locale = localStorage.getItem('locale');
        if (!locale) {
            return;
        }
        messages.setLocale(locale);
    }
    init() {
        this.restoreLocale();
        document.querySelector(".display")
            .appendChild(this.display.getContainer());
        this.game.init();
    }
    saveApp() {
        const data = {};
        data.userName = this.userName;
        data.game = this.game.toString();
        data.date = moment().format("MMM Do YY, HH:mm:ss");
        localStorage.setItem('app', JSON.stringify(data));
    }
    loadApp() {
        const data = JSON.parse(localStorage.getItem('app'));
        this.userName = data.userName;
        this.game = this.game.fromString(data.game);
    }
    run() {
        this.game.mainloop();
    }
}
