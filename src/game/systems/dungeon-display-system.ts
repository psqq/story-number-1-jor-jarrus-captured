import { Display } from "rot-js";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import DungeonComponent from "../components/dungeon-component";
import config from "../../config";
import range from "../../tools/range";
import FovComponent from "../components/fov-component";
import BaseSystem from "./base-system";
import Victor = require("victor");

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
            FovComponent,
        ]);
        this.display = display;
    }
    update(deltaTime: number = 0) {
        let fov = this.fovEntities.getEnties()[0].get(FovComponent).fov;
        let map = this.getCurrentDungeon().get(DungeonComponent).map;
        for (let x of range(config.map.size.x)) {
            for (let y of range(config.map.size.y)) {
                if (!fov[x][y]) {
                    continue;
                }
                const fg = config.map.fgColor;
                const bg = config.map.bgColor;
                const ch = map[x][y];
                const viewPosition =
                    new Victor(x, y)
                        .add(new Victor(config.map.offset.x, config.map.offset.y));
                this.display.draw(viewPosition.x, viewPosition.y, ch, fg, bg);
            }
        }
    }
}
