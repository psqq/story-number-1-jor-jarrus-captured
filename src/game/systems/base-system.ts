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
    getLightPassesCallback() {
        return (x: number, y: number) => {
            return this.isMovablePosition(new Victor(x, y));
        };
    }
    isMovablePosition(position: Victor): boolean {
        const map = this.mapEntities.getEnties()[0].get(DungeonComponent).map;
        const { x, y } = position;
        if (x < 0 || y < 0 || x >= config.map.size.x || y >= config.map.size.y) {
            return false;
        }
        if (map[x][y] === config.map.wall.symbol) {
            return false;
        }
        return true;
    }
    getMovablePositions(): Victor[] {
        let positions: Victor[] = [];
        const map = this.mapEntities.getEnties()[0].get(DungeonComponent).map;
        for (let x of range(config.map.size.x)) {
            for (let y of range(config.map.size.y)) {
                const v = new Victor(x, y);
                if (this.isMovablePosition(v)) {
                    positions.push(v);
                }
            }
        }
        return positions;
    }
    update(deltaTime: number = 0) { }
}
