import Digger from "rot-js/lib/map/digger";
import Victor from 'victor';
import Component from "./core/ecs-engine/component";
import Engine from "./core/ecs-engine/engine";
import popRandomElement from "./tools/pop-random-element";
import matrix from "./tools/matrix";
import config from "./config";
import DungeonComponent from "./components/dungeon-component";
import Position2DComponent from "./components/position-2d-component";
import GlyphComponent from "./components/glyph-component";
import PlayerComponent from "./components/player-component";
import MoveDirection2DComponent from "./components/move-direction-2d-component";
import FovComponent from "./components/fov-component";
import StairsComponent from "./components/stairs-component";
import MemorizedFovAreaComponent from "./components/memorized-fov-area-component";
import ExperienceLevelComponent from "./components/experience-level-component";
import PhysicalDamageComponent from "./components/physical-damage-component";
import HealthPointsComponent from "./components/health-points-component";
import ObstacleComponent from "./components/obstacle-component";
import TeamComponent from "./components/team-component";
import AutoAttackComponent from "./components/auto-attack-component";
import DeepComponent from "./components/deep-compnent";
import DepthMovingComponent from "./components/depth-moving-component";
import SimpleAiComponent from "./components/simple-ai-component";
import KillComponent from "./components/kill-component";

export default class EntitiesBuilder {
    constructor() {
        /** @type {Component[][]} */
        this.entities = [];
    }
    /**
     * @param {Engine} engine 
     */
    addCreatedEntitiesToEngine(engine) {
        for (let components of this.entities) {
            engine.createEntity(components);
        }
        this.entities = [];
        return this;
    }
    createSurface() {
        return this;
    }
    /**
     * @param {number} deep 
     */
    createDungeon(deep) {
        // if (deep == 0) {
        //     return this.createSurface();
        // }
        /** @type {string[][]} */
        const map = [];
        /** @type {Victor[]} */
        const floorPositions = [];
        for (let x = 0; x < config.map.size.x; x++) {
            map[x] = [];
            for (let y = 0; y < config.map.size.y; y++) {
                map[x][y] = config.map.wall.symbol;
            }
        }
        const mapDigger = new Digger(config.map.size.x, config.map.size.y);
        mapDigger.create((x, y, value) => {
            if (value) {
                map[x][y] = config.map.wall.symbol;
            } else {
                map[x][y] = config.map.floor.symbol;
                floorPositions.push(new Victor(x, y));
            }
        });
        this.entities.push([
            new DungeonComponent()
                .setup({
                    map
                }),
            new DeepComponent()
                .setup({
                    deep
                })
        ]);
        const stairsDownPosition = popRandomElement(floorPositions);
        this.createStairs(stairsDownPosition, deep, deep + 1);
        const stairsUpPosition = popRandomElement(floorPositions);
        this.createStairs(stairsUpPosition, deep, deep - 1);
        const n = 3 + Math.random() * 10;
        for (let i = 0; i < n; i++) {
            this.createGoblinMinion(popRandomElement(floorPositions), deep);
        }
        return this;
    }
    /**
     * @param {Victor} position 
     * @param {number} deep 
     */
    createPlayer(position, deep) {
        this.entities.push([
            new TeamComponent()
                .setup({
                    teamName: 'humans',
                }),
            new ObstacleComponent(),
            new FovComponent()
                .setup({
                    fov: matrix(config.map.size.x, config.map.size.y, false)
                }),
            new PlayerComponent(),
            new MoveDirection2DComponent(),
            new DepthMovingComponent(),
            new MemorizedFovAreaComponent()
                .setup({
                    memorizedFovArea: matrix(config.map.size.x, config.map.size.y, false),
                    deep,
                }),
            new Position2DComponent()
                .setup({
                    x: position.x,
                    y: position.y,
                }),
            new DeepComponent()
                .setup({
                    deep
                }),
            new GlyphComponent()
                .setup({
                    symbol: '@',
                    fgColor: 'white',
                    zLevel: 1000
                }),
            new ExperienceLevelComponent()
                .setup({
                    level: 1,
                    currentExperience: 0,
                    nextLevelExperience: config.experience.experienceEnhancer,
                }),
            new PhysicalDamageComponent()
                .setup({
                    basePhysicalDamage: config.heroStats.physicalDamage,
                    bonusPhysicalDamage: 0,
                    currentPhysicalDamage: config.heroStats.physicalDamage,
                    enhancerPhysicalDamagePerLevel: config.heroStats.physicalDamagePerLevel,
                    maxPhysicalDamage: config.heroStats.physicalDamage,
                }),
            new HealthPointsComponent()
                .setup({
                    baseHealthPoints: config.heroStats.healthPoints,
                    bonusHealthPoints: 0,
                    currentHealthPoints: config.heroStats.healthPoints,
                    enhancerHealthPointsPerLevel: config.heroStats.healthPointsPerLevel,
                    maxHealthPoints: config.heroStats.healthPoints,
                }),
        ]);
        return this;
    }
    /**
     * @param {Victor} position 
     * @param {number} deep 
     */
    createGoblinMinion(position, deep) {
        this.entities.push([
            new TeamComponent()
                .setup({
                    teamName: 'goblins',
                }),
            new ObstacleComponent(),
            new SimpleAiComponent(),
            new MoveDirection2DComponent(),
            new Position2DComponent()
                .setup({
                    x: position.x,
                    y: position.y,
                }),
            new DeepComponent()
                .setup({
                    deep
                }),
            new GlyphComponent()
                .setup({
                    symbol: 'g',
                    fgColor: 'green',
                    zLevel: 500
                }),
            new PhysicalDamageComponent()
                .setup({
                    basePhysicalDamage: config.goblinMinionStats.physicalDamage,
                    bonusPhysicalDamage: 0,
                    currentPhysicalDamage: config.goblinMinionStats.physicalDamage,
                    enhancerPhysicalDamagePerLevel: config.goblinMinionStats.physicalDamagePerLevel,
                    maxPhysicalDamage: config.goblinMinionStats.physicalDamage,
                }),
            new HealthPointsComponent()
                .setup({
                    baseHealthPoints: config.goblinMinionStats.healthPoints,
                    bonusHealthPoints: 0,
                    currentHealthPoints: config.goblinMinionStats.healthPoints,
                    enhancerHealthPointsPerLevel: config.goblinMinionStats.healthPointsPerLevel,
                    maxHealthPoints: config.goblinMinionStats.healthPoints,
                }),
        ]);
        return this;
    }
    /**
     * @param {number} attackingId 
     * @param {number} protectingId 
     */
    createAutoAttackEntity(attackingId, protectingId) {
        this.entities.push([
            new AutoAttackComponent()
                .setup({
                    attackingId: attackingId,
                    protectingId: protectingId,
                })
        ]);
        return this;
    }
    /**
     * @param {number} attackingId 
     * @param {number} protectingId 
     */
    createKillEntity(killerId, killedId) {
        this.entities.push([
            new KillComponent()
                .setup({
                    killerId: killerId,
                    killedId: killedId,
                })
        ]);
        return this;
    }
    /**
     * @param {Victor} position 
     * @param {number} deep 
     * @param {number} depthChange 
     */
    createStairs(position, deep, toDeep) {
        this.entities.push([
            new StairsComponent()
                .setup({
                    toDeep
                }),
            new Position2DComponent()
                .setup({
                    x: position.x,
                    y: position.y,
                }),
            new DeepComponent()
                .setup({
                    deep
                }),
            new GlyphComponent()
                .setup({
                    symbol: toDeep > deep ? '>' : '<',
                    fgColor: 'white',
                    zLevel: 400
                }),
        ]);
        return this;
    }
}
