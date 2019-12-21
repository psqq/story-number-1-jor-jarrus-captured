import System from "../../core/system";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import DungeonComponent from "../components/dungeon-component";
import Victor = require("victor");
import range from "../../core/range";
import config from "../../config";

export default class BaseSystem extends System {
    private mapEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.mapEntities = new SmartEntitiesContainer(engine, [
            DungeonComponent
        ]);
    }
    getFreePositions(): Victor[] {
        let positions: Victor[] = [];
        for (let entity of this.mapEntities.getEnties()) {
            for (let x of range(config.map.size.x)) {
                for (let y of range(config.map.size.y)) {
                    const map = entity.get(DungeonComponent).map;
                    if (map[x][y] === config.map.floor.symbol) {
                        positions.push(new Victor(x, y));
                    }
                }
            }
        }
        return positions;
    }
    update(deltaTime: number = 0) { }
}
