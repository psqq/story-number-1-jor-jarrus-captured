import { Display } from "rot-js";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import DungeonComponent from "../components/dungeon-component";
import config from "../../config";
import range from "../../tools/range";
import FovComponent from "../components/fov-component";
import BaseSystem from "./base-system";
import Victor = require("victor");
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";

export default class DungeonDisplaySystem extends BaseSystem {
    private display: Display;
    private mapEntities: SmartEntitiesContainer;
    private fovEntities: SmartEntitiesContainer;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.mapEntities = new SmartEntitiesContainer(engine, [
            DungeonComponent,
        ]);
        this.fovEntities = new SmartEntitiesContainer(engine, [
            FovComponent, MemorizedFovAreaComponent
        ]);
        this.display = display;
    }
    clear() {
        super.clear();
        this.mapEntities.clear();
        this.fovEntities.clear();
    }
    update(deltaTime: number = 0) {
        let fov = this.getPlayerFov().fov;
        let memorizedFovArea = this.getPlayerMemorizedFovArea().memorizedFovArea;
        let map = this.getCurrentDungeon().get(DungeonComponent).map;
        for (let x of range(config.map.size.x)) {
            for (let y of range(config.map.size.y)) {
                let memorized = false;
                if (!(fov[x][y] || memorizedFovArea[x][y])) {
                    continue;
                }
                if (!fov[x][y]) {
                    memorized = true;
                }
                let fg = config.map.fgColor;
                let bg = config.map.bgColor;
                if (memorized) {
                    fg = config.map.memorizedColor.fgColor;
                    bg = config.map.memorizedColor.bgColor;
                }
                const ch = map[x][y];
                const viewPosition =
                    new Victor(x, y)
                        .add(new Victor(config.map.offset.x, config.map.offset.y));
                this.display.draw(viewPosition.x, viewPosition.y, ch, fg, bg);
            }
        }
    }
}
