import Victor from 'victor';
import System from "../core/ecs-engine/system";
import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import range from "../tools/range";
import config from "../config";
import DungeonComponent from "../components/dungeon-component";
import PlayerComponent from "../components/player-component";
import Position2DComponent from "../components/position-2d-component";
import StairsComponent from "../components/stairs-component";
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";
import FovComponent from "../components/fov-component";
import ObstacleComponent from "../components/obstacle-component";
import TeamComponent from "../components/team-component";
import IdComponent from "../components/id-component";
import HealthPointsComponent from "../components/health-points-component";
import PhysicalDamageComponent from "../components/physical-damage-component";
import MoveDirectionComponent from "../components/move-direction-component";
import DeepComponent from "../components/deep-compnent";

export default class BaseSystem extends System {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.baseDungeonEntities = new SmartEntitiesContainer(engine, [
            DungeonComponent, DeepComponent
        ]);
        this.basePlayerEntities = new SmartEntitiesContainer(engine, [
            PlayerComponent,
            TeamComponent,
            Position2DComponent, DeepComponent,
            MoveDirectionComponent,
            FovComponent, MemorizedFovAreaComponent,
            IdComponent,
            HealthPointsComponent,
            PhysicalDamageComponent,
            ObstacleComponent,
        ]);
        this.baseStairsEntities = new SmartEntitiesContainer(engine, [
            StairsComponent, Position2DComponent, DeepComponent
        ]);
        this.baseObstacleEntities = new SmartEntitiesContainer(engine, [
            Position2DComponent, DeepComponent, ObstacleComponent
        ]);
        this.baseTeamBeingsEntities = new SmartEntitiesContainer(engine, [
            TeamComponent, IdComponent, Position2DComponent, DeepComponent,
        ]);
    }
    erase() {
        super.erase();
        this.baseDungeonEntities.erase();
        this.basePlayerEntities.erase();
        this.baseTeamBeingsEntities.erase();
        this.baseStairsEntities.erase();
        this.baseObstacleEntities.erase();
    }
    /**
     * @param {Victor} position 
     * @param {number} deep 
     */
    getTeamBeing(position, deep = null) {
        for (let teamBeing of this.baseTeamBeingsEntities.getEnties()) {
            if (
                position.isEqualTo(
                    teamBeing.get(Position2DComponent)
                )
            ) {
                return teamBeing;
            }
        }
    }
    /**
     * @param {number} deep 
     */
    getPlayerMemorizedFovArea(deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        for (let memorizedFovArea of this.getPlayer().gets(MemorizedFovAreaComponent)) {
            if (memorizedFovArea.deep == deep) {
                return memorizedFovArea;
            }
        }
    }
    getPlayerFov() {
        return this.getPlayer().get(FovComponent);
    }
    /**
     * @param {numbeer} toDeep 
     * @param {number} deep 
     */
    getStairs(toDeep, deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        for (let stairs of this.baseStairsEntities.getEnties()) {
            if (stairs.get(DeepComponent).deep == deep
                && stairs.get(StairsComponent).toDeep == toDeep
            ) {
                return stairs;
            }
        }
    }
    getPlayer() {
        return this.basePlayerEntities.getEnties()[0];
    }
    /**
     * @param {number} deep 
     */
    getDungeon(deep) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        for (let dungeon of this.baseDungeonEntities.getEnties()) {
            const deepComp = dungeon.get(DeepComponent);
            if (deepComp.deep === deep) {
                return dungeon;
            }
        }
    }
    getPlayerDeep() {
        return this.getPlayer().get(DeepComponent).deep;
    }
    getCurrentDungeon() {
        return this.getDungeon(this.getPlayerDeep());
    }
    /**
     * @param {number} deep
     */
    getLightPassesCallback(deep = null) {
        return (x, y) => {
            return this.isLightPasses(new Victor(x, y), deep);
        };
    }
    /**
     * @param {Victor} position 
     * @param {number} deep 
     */
    isLightPasses(position, deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
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
    /**
     * @param {Victor} position 
     * @param {number} deep 
     */
    isMovablePosition(position, deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
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
            let pos = obstacleEntity.get(Position2DComponent);
            if (pos.deep != deep) {
                continue;
            }
            if (position.isEqualTo(pos.toVictor())) {
                return false;
            }
        }
        return true;
    }
    /**
     * @param {number} deep 
     */
    getMovablePositions(deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        /** @type {Victor[]} */
        const positions = [];
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
    /**
     * @param {number} deep 
     */
    getRandomMovablePosition(deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        const movablePositions = this.getMovablePositions(deep);
        const position = movablePositions[Math.floor(Math.random() * movablePositions.length)];
        return position;
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) { }
}
