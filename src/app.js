import { Display } from "rot-js";
import config from "./config";
import Game from "./game";
import messages from "./messages";

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
    run() {
        this.game.mainloop();
    }
}
