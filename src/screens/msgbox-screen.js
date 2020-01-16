import Screen from "./screen";
import * as c from "../components";
import { getDirectionByKeyboardEvent, doWith } from "../tools";

export default class MsgboxScreen extends Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.events = [];
        this.el = document.querySelector(".msgbox");
    }
    addMsg(msg) {
        const t = this.app.game.time;
        const s = `[${t}] ${msg}\n`;
        this.el.innerText = s + this.el.innerText;
    }
}
