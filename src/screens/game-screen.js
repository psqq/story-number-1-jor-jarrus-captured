import Screen from "./screen";
import * as c from "../components";
import { getDirectionByKeyboardEvent, doWith } from "../tools";
import Victor from "victor";
import config from "../config";

export default class GameScreen extends Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(".game-screen");
        this.msgboxEl = document.querySelector(".msgbox");
        this.events.push('mousedown');
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
                this.switchTo(this.app.game.scr.mainMenu);
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
        } else if (e instanceof MouseEvent) {
            const posArr = this.app.display.eventToPosition(e);
            const pos = new Victor(posArr[0], posArr[1]);
            if (pos.x >= 0 && pos.x < config.map.size.x && pos.y >= 0 && pos.y < config.map.size.y) {
                this.app.game.scr.cellInfo.position = pos;
                this.switchTo(this.app.game.scr.cellInfo);
            }
        }
    }
}
