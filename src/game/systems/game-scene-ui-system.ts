import { Display } from "rot-js";
import Engine from "../../core/engine";
import BaseSystem from "./base-system";
import config from "../../config";
import PositionComponent from "../components/position-component";

export default class GameSceneUiSystem extends BaseSystem {
    private display: Display;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.display = display;
    }
    update(deltaTime: number = 0) {
        let topBarInfo = '';
        let bottomBarInfo = '';
        const player = this.getPlayer();
        const deep = player.get(PositionComponent).deep;
        topBarInfo += `Deep: ${deep}`;
        this.display.drawText(config.gameSceneBars.top.x, config.gameSceneBars.top.y, topBarInfo);
        this.display.drawText(config.gameSceneBars.bottom.x, config.gameSceneBars.bottom.y, bottomBarInfo);
    }
}
