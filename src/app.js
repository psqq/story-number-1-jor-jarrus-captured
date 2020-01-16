import { Display } from "rot-js";
import config from "./config";

export default class App {
    constructor() {
        // display
        this.display = new Display(config.rotjsDisplayOptions);
        // others
        this.userName = config.defaultUserName;
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
    }
    run() {
    }
}
