import System from "../../core/system";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import DungeonComponent from "../components/dungeon-component";
import Victor = require("victor");
import range from "../../tools/range";
import config from "../../config";
import Entity from "../../core/entity";
import PlayerComponent from "../components/player-component";
import PositionComponent from "../components/position-component";
import EntitiesBuilder from "../entities-builder";

export default class BaseSystem extends System {
    private mapEntities: SmartEntitiesContainer;
    private playerEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.mapEntities = new SmartEntitiesContainer(engine, [
            DungeonComponent
        ]);
        this.playerEntities = new SmartEntitiesContainer(engine, [
            PlayerComponent
        ]);
    }
    getPlayer(): Entity {
        return this.playerEntities.getEnties()[0];
    }
    getDungeon(deep: number): Entity {
        for (let dungeon of this.mapEntities.getEnties()) {
            if (dungeon.get(DungeonComponent).deep === deep) {
                return dungeon;
            }
        }
    }
    getCurrentDeep() {
        return this.getPlayer().get(PositionComponent).deep;
    }
    getCurrentDungeon() {
        return this.getDungeon(this.getCurrentDeep());
    }
    getLightPassesCallback(deep?: number) {
        return (x: number, y: number) => {
            return this.isMovablePosition(new Victor(x, y), deep);
        };
    }
    isMovablePosition(position: Victor, deep?: number): boolean {
        if (deep === undefined) {
            deep = this.getCurrentDeep();
        }
        const map = this.getDungeon(deep).get(DungeonComponent).map;
        const { x, y } = position;
        if (x < 0 || y < 0 || x >= config.map.size.x || y >= config.map.size.y) {
            return false;
        }
        if (map[x][y] === config.map.wall.symbol) {
            return false;
        }
        return true;
    }
    getMovablePositions(deep?: number): Victor[] {
        let positions: Victor[] = [];
        for (let x of range(config.map.size.x)) {
            for (let y of range(config.map.size.y)) {
                const v = new Victor(x, y);
                if (this.isMovablePosition(v, deep)) {
                    positions.push(v);
                }
            }
        }
        return positions;
    }
    getRandomMovablePosition(deep?: number): Victor {
        const movablePositions = this.getMovablePositions(deep);
        const position = movablePositions[Math.floor(Math.random() * movablePositions.length)];
        return position;
    }
    update(deltaTime: number = 0) { }
}
