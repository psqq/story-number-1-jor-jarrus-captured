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
import MoveDirection2DComponent from "../components/move-direction-2d-component";
import DeepComponent from "../components/deep-compnent";
import Entity from '../core/ecs-engine/entity';

class Damage {
    constructor(physical, magic) {
        this.physical = physical;
        this.magic = magic;
    }
    getTotal() {
        return this.physical + this.magic;
    }
}

export default class BaseSystem extends System {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.baseDungeonEntities = this.engine.getSmartEntityContainer([
            DungeonComponent, DeepComponent
        ]);
        this.basePlayerEntities = this.engine.getSmartEntityContainer([
            PlayerComponent,
            TeamComponent,
            Position2DComponent, DeepComponent,
            MoveDirection2DComponent,
            FovComponent, MemorizedFovAreaComponent,
            HealthPointsComponent,
            PhysicalDamageComponent,
            ObstacleComponent,
        ]);
        this.baseStairsEntities = this.engine.getSmartEntityContainer([
            StairsComponent, Position2DComponent, DeepComponent
        ]);
        this.baseObstacleEntities = this.engine.getSmartEntityContainer([
            Position2DComponent, DeepComponent, ObstacleComponent
        ]);
        this.baseTeamBeingsEntities = this.engine.getSmartEntityContainer([
            TeamComponent, Position2DComponent, DeepComponent,
        ]);
        this.basePositionEntities = this.engine.getSmartEntityContainer([
            Position2DComponent, DeepComponent,
        ]);
    }
    /**
     * @param {Entity} attacker 
     * @param {Entity} protecter 
     */
    onKill(attacker, protecter) {
    }
    /**
     * @param {Entity} attacker 
     * @param {Entity} protecter 
     */
    doAa(attacker, protecter) {
        const dmg = this.getAaDamage(attacker);
        this.takeDamage(protecter, dmg);
        if (!this.isAlive(protecter)) {
            this.onKill(attacker, protecter);
        }
    }
    /**
     * @param {Entity} entity
     */
    isAlive(entity) {
        const hpComp = entity.get(HealthPointsComponent);
        if (hpComp && hpComp.currentHealthPoints <= 0) {
            return false;
        }
        return true;
    }
    /**
     * @param {Entity} attacker 
     */
    getAaDamage(attacker) {
        return new Damage(
            attacker.get(PhysicalDamageComponent).currentPhysicalDamage,
            0
        );
    }
    /**
     * @param {Entity} protecter 
     * @param {Damage} damage
     */
    takeDamage(protecter, damage) {
        const hpComp = protecter.get(HealthPointsComponent);
        hpComp.currentHealthPoints -= damage.getTotal();
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
    getEntitiesInPosition(position, deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        const result = [];
        for (let entity of this.basePositionEntities.getEnabledEnties()) {
            const posComp = entity.get(Position2DComponent);
            const deepComp = entity.get(DeepComponent);
            if (deepComp.deep != deep) {
                continue;
            }
            if (position.isEqualTo(posComp)) {
                result.push(entity);
            }
        }
        return result;
    }
    /**
     * @param {Victor} position 
     * @param {number} deep 
     */
    getTeamBeing(position, deep = null) {
        for (let teamBeing of this.baseTeamBeingsEntities.getAllEnties()) {
            const teamBeingPos = this.getPosition(teamBeing);
            if (teamBeingPos.isEqualTo(position)) {
                return teamBeing;
            }
        }
    }
    /**
     * @param {Victor} position 
     * @param {number} deep 
     */
    getEnemy(position, deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        const enemy = this.getTeamBeing(position, deep);
        if (!enemy) {
            return;
        }
        const team = enemy.get(TeamComponent).teamName;
        if (enemy && team == config.teams.goblins) {
            return enemy;
        }
    }
    /**
     * @param {number} deep 
     */
    getPlayerMemorizedFovArea(deep = null) {
        if (!this.getPlayer()) {
            return;
        }
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
        if (!this.getPlayer()) {
            return;
        }
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
        for (let stairs of this.baseStairsEntities.getAllEnties()) {
            if (stairs.get(DeepComponent).deep == deep
                && stairs.get(StairsComponent).toDeep == toDeep
            ) {
                return stairs;
            }
        }
    }
    getPlayer() {
        return this.basePlayerEntities.getAllEnties()[0];
    }
    getPlayerPosition() {
        return this.getPosition(this.getPlayer());
    }
    getPosition(entity) {
        return new Victor().copy(entity.get(Position2DComponent));
    }
    /**
     * @param {number} deep 
     */
    getDungeon(deep) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        for (let dungeon of this.baseDungeonEntities.getAllEnties()) {
            const deepComp = dungeon.get(DeepComponent);
            if (deepComp.deep === deep) {
                return dungeon;
            }
        }
    }
    getPlayerDeep() {
        if (!this.getPlayer()) {
            return;
        }
        return this.getPlayer().get(DeepComponent).deep;
    }
    getCurrentDungeon() {
        if (!this.getPlayer()) {
            return;
        }
        return this.getDungeon(this.getPlayerDeep());
    }
    /**
     * @param {number} deep
     */
    getLightPassesCallback(deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        return (x, y) => {
            return this.isLightPasses(new Victor(x, y), deep);
        };
    }
    /**
     * @param {Entity} entity
     * @param {number} deep
     */
    getPassableCallbackForEntity(entity, deep = null) {
        if (deep == null) {
            deep = this.getPlayerDeep();
        }
        return (x, y) => {
            if (new Victor(x, y).isEqualTo(entity.get(Position2DComponent))) {
                return true;
            }
            return this.isMovablePosition(new Victor(x, y), deep);
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
        for (let obstacleEntity of this.baseObstacleEntities.getEnabledEnties()) {
            let posComp = obstacleEntity.get(Position2DComponent);
            if (obstacleEntity.get(DeepComponent).deep != deep) {
                continue;
            }
            if (position.isEqualTo(posComp)) {
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
