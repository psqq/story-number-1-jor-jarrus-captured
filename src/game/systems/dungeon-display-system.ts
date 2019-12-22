import System from "../../core/system";
import { Display } from "rot-js";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import DungeonComponent from "../components/dungeon-component";
import config from "../../config";
import range from "../../tools/range";
import FovComponent from "../components/fov-component";

export default class DungeonDisplaySystem extends System {
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
        let map = this.mapEntities.getEnties()[0].get(DungeonComponent).map;
        for (let x of range(config.map.size.x)) {
            for (let y of range(config.map.size.y)) {
                if (!fov[x][y]) {
                    continue;
                }
                const fg = config.map.fgColor;
                const bg = config.map.bgColor;
                const ch = map[x][y];
                this.display.draw(x, y, ch, fg, bg);
            }
        }
    }
}
