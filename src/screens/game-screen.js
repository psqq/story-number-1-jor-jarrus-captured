import Screen from "./screen";
import * as c from "../components";
import { getDirectionByKeyboardEvent, doWith } from "../tools";

export default class GameScreen extends Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(".game-screen");
        this.msgboxEl = document.querySelector(".msgbox");
    }
    addMsg(msg) {
        const t = this.app.game.time;
        const s = `[${t}] ${msg}\n`;
        this.msgboxEl.innerText = s + this.el.innerText;
    }
    handleEvent(e) {
        if (e instanceof KeyboardEvent) {
            // console.log(e);
            if (e.key == "Escape") {
                this.back();
                return;
            }
            const dir = getDirectionByKeyboardEvent(e);
            if (dir) {
                const player = this.app.game.player;
                doWith(player.get(c.MoveDirection), c => {
                    c.x = dir.x;
                    c.y = dir.y;
                });
            }
        }
    }
}
