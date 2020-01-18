import { Display } from "rot-js";
import config from "./config";
import Game from "./game";
import messages from "./messages";
import moment from "moment";

export default class App {
    constructor() {
        this.display = new Display(config.rotjsDisplayOptions);
        this.userName = config.defaultUserName;
        /** @type {Game} */
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
        localStorage.setItem('userName', this.userName);
        const date = moment().format("MMM Do YY, HH:mm:ss")
        localStorage.setItem('date', date);
        localStorage.setItem('game', this.game.toString());
    }
    loadApp() {
        this.userName = localStorage.getItem('userName');
        this.game.fromString(localStorage.getItem('game'));
    }
    run() {
        this.game.mainloop();
    }
}
