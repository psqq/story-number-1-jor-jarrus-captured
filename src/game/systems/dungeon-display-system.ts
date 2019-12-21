import System from "../../core/system";
import { Display } from "rot-js";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import DungeonComponent from "../components/dungeon-component";
import config from "../../config";
import range from "../../core/range";

export default class DungeonDisplaySystem extends System {
    private display: Display;
    private smartEntities: SmartEntitiesContainer;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.smartEntities = new SmartEntitiesContainer(engine, [
            DungeonComponent,
        ]);
        this.display = display;
    }
    update(deltaTime: number = 0) {
        for (let entity of this.smartEntities.getEnties()) {
            let map = entity.get(DungeonComponent).map;
            for (let x of range(config.map.size.x)) {
                for (let y of range(config.map.size.y)) {
                    const fg = config.map.fgColor;
                    const bg = config.map.bgColor;
                    const ch = map[x][y];
                    this.display.draw(x, y, ch, fg, bg);
                }
            }
        }
    }
}
