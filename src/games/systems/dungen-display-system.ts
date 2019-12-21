import System from "../../core/system";
import { Display } from "rot-js";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import DungeonComponent from "../components/dungeon-component";
import config from "../../config";

export default class DungeonDisplaySystem extends System {
    private display: Display;
    private entities: SmartEntitiesContainer;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.entities = new SmartEntitiesContainer(engine, [
            DungeonComponent,
        ]);
        this.display = display;
    }
    update(deltaTime: number = 0) {
        for (let entity of this.entities.getEnties()) {
            let map = entity.get(DungeonComponent).map;
            for (let x = 0; x < config.map.size.x; x++) {
                for (let y = 0; y < config.map.size.y; y++) {
                    const fg = config.map.fgColor;
                    const bg = config.map.bgColor;
                    const ch = map.get(`${x},${y}`);
                    this.display.draw(x, y, ch, fg, bg);
                }
            }
        }
    }
}
