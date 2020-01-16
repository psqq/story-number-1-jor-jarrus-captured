import Screen from "./screen";
import * as c from "../components";
import { getDirectionByKeyboardEvent, doWith } from "../tools";

export default class GameScreen extends Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
    }
    handleEvent(e) {
        if (e instanceof KeyboardEvent) {
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
