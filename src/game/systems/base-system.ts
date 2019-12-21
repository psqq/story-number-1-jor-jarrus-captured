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
    isMovablePosition(position: Victor): boolean {
        for (let entity of this.mapEntities.getEnties()) {
            const map = entity.get(DungeonComponent).map;
            const { x, y } = position;
            if (map[x][y] === config.map.wall.symbol) {
                return false;
            }
        }
        return true;
    }
    getMovablePositions(): Victor[] {
        let positions: Victor[] = [];
        for (let entity of this.mapEntities.getEnties()) {
            const map = entity.get(DungeonComponent).map;
            for (let x of range(config.map.size.x)) {
                for (let y of range(config.map.size.y)) {
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
