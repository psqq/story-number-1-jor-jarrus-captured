import System from "../../core/system";
import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import DungeonComponent from "../components/dungeon-component";
import Victor = require("victor");
import range from "../../tools/range";
import sign from "../../tools/sign";
import config from "../../config";
import Entity from "../../core/entity";
import PlayerComponent from "../components/player-component";
import PositionComponent from "../components/position-component";
import StairsComponent from "../components/stairs-component";
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";
import FovComponent from "../components/fov-component";

export default class BaseSystem extends System {
    private baseMapEntities: SmartEntitiesContainer;
    private basePlayerEntities: SmartEntitiesContainer;
    private stairsEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.baseMapEntities = new SmartEntitiesContainer(engine, [
            DungeonComponent
        ]);
        this.basePlayerEntities = new SmartEntitiesContainer(engine, [
            PlayerComponent, PositionComponent, MemorizedFovAreaComponent,
            FovComponent,
        ]);
        this.stairsEntities = new SmartEntitiesContainer(engine, [
            StairsComponent, PositionComponent
        ]);
    }
    getPlayerMemorizedFovArea(deep?: number): MemorizedFovAreaComponent {
        if (deep == null) {
            deep = this.getCurrentDeep();
        }
        for(let memorizedFovArea of this.getPlayer().gets(MemorizedFovAreaComponent)) {
            if (memorizedFovArea.deep == deep) {
                return memorizedFovArea;
            }
        }
    }
    getPlayerFov(): FovComponent {
        return this.getPlayer().get(FovComponent);
    }
    getStairs(depthChange: number, deep?: number): Entity {
        if (deep == null) {
            deep = this.getCurrentDeep();
        }
        for (let stairs of this.stairsEntities.getEnties()) {
            if (stairs.get(PositionComponent).deep != deep) {
                continue;
            }
            const a = sign(stairs.get(StairsComponent).depthChange);
            const b = sign(depthChange);
            if (a === b) {
                return stairs;
            }
        }
    }
    getPlayer(): Entity {
        return this.basePlayerEntities.getEnties()[0];
    }
    getDungeon(deep: number): Entity {
        for (let dungeon of this.baseMapEntities.getEnties()) {
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
        if (deep == null) {
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
        if (deep == null) {
            deep = this.getCurrentDeep();
        }
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
        if (deep == null) {
            deep = this.getCurrentDeep();
        }
        const movablePositions = this.getMovablePositions(deep);
        const position = movablePositions[Math.floor(Math.random() * movablePositions.length)];
        return position;
    }
    update(deltaTime: number = 0) { }
}
