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
import ObstacleComponent from "../components/obstacle-component";
import TeamComponent from "../components/team-component";
import IdComponent from "../components/id-component";
import HealthPointsComponent from "../components/health-points-component";
import PhysicalDamageComponent from "../components/physical-damage-component";
import MoveDirectionComponent from "../components/move-direction-component";

export default class BaseSystem extends System {
    private baseMapEntities: SmartEntitiesContainer;
    private basePlayerEntities: SmartEntitiesContainer;
    private teamBeingsEntities: SmartEntitiesContainer;
    private baseStairsEntities: SmartEntitiesContainer;
    private baseObstacleEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.baseMapEntities = new SmartEntitiesContainer(engine, [
            DungeonComponent
        ]);
        this.basePlayerEntities = new SmartEntitiesContainer(engine, [
            PlayerComponent,
            TeamComponent,
            PositionComponent, MoveDirectionComponent,
            FovComponent, MemorizedFovAreaComponent,
            IdComponent,
            HealthPointsComponent,
            PhysicalDamageComponent,
            ObstacleComponent,
        ]);
        this.baseStairsEntities = new SmartEntitiesContainer(engine, [
            StairsComponent, PositionComponent
        ]);
        this.baseObstacleEntities = new SmartEntitiesContainer(engine, [
            PositionComponent, ObstacleComponent
        ]);
        this.teamBeingsEntities = new SmartEntitiesContainer(engine, [
            TeamComponent, IdComponent, PositionComponent,
        ]);
    }
    getTeamBeing(position: Victor, deep?: number) {
        for (let teamBeing of this.teamBeingsEntities.getEnties()) {
            if (teamBeing.get(PositionComponent).toVictor().isEqualTo(position)) {
                return teamBeing;
            }
        }
    }
    getPlayerMemorizedFovArea(deep?: number): MemorizedFovAreaComponent {
        if (deep == null) {
            deep = this.getCurrentDeep();
        }
        for (let memorizedFovArea of this.getPlayer().gets(MemorizedFovAreaComponent)) {
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
        for (let stairs of this.baseStairsEntities.getEnties()) {
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
            return this.isLightPasses(new Victor(x, y), deep);
        };
    }
    isLightPasses(position: Victor, deep?: number): boolean {
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
        for (let obstacleEntity of this.baseObstacleEntities.getEnties()) {
            let pos = obstacleEntity.get(PositionComponent);
            if (pos.deep != deep) {
                continue;
            }
            if (position.isEqualTo(pos.toVictor())) {
                return false;
            }
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
