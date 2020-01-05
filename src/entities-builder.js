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
import TypeComponent from "./components/type-component";
import With from "./tools/with";
import ShieldPDmgForKillPassiveSkillComponent from "./components/shield-pdmg-for-kill-passive-skill-component";
import HeroQSkillComponent from './components/hero-qskill-component';
import CharacteristicsComponent from './components/characteristics-component';
import randint from "./tools/randint";

export default class EntitiesBuilder {
    constructor() {
        /** @type {Component[][]} */
        this.entities = [];
        /** @type {{componets: Component[], groups: string[]}[]} */
        this.entitiesWithGroups = [];
    }
    /**
     * @param {Engine} engine 
     */
    addCreatedEntitiesToEngine(engine) {
        for (let components of this.entities) {
            engine.createEntity(components);
        }
        for (let entityOptions of this.entitiesWithGroups) {
            engine.createEntity(entityOptions.componets, entityOptions.groups);
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
            new With(new AutoAttackComponent())
                .do(x => {
                    x.targetId = null;
                })
                .finish(),
            new With(new TypeComponent())
                .do(x => {
                    x.typeName = config.beingTypes.player;
                })
                .finish(),
            new TeamComponent()
                .setup({
                    teamName: config.teams.humans,
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
            new With(new CharacteristicsComponent())
                .do(x => {
                    const hp = randint(...config.heroStats.healthPoints);
                    const hpPerLvl = randint(...config.heroStats.healthPointsPerLevel);
                    x.healthPoints = {
                        current: hp,
                        base: hp,
                        bonus: 0,
                        total: 0,
                        perLevel: hpPerLvl,
                    };
                    const pDmg = randint(...config.heroStats.physicalDamage);
                    const pDmgPerLvl = randint(...config.heroStats.physicalDamagePerLevel);
                    x.physicalDamage = {
                        current: 0,
                        base: 0,
                        bonus: 0,
                        total: 0,
                        perLevel: 0,
                    };
                })
                .finish(),
            new With(new ShieldPDmgForKillPassiveSkillComponent())
                .do(x => {
                    const skill = config.skills.shieldPDmgForKillPassiveSkillComponent;
                    x.shield = 0;
                    x.shieldForKill = skill.shieldForKill[1];
                    x.pDmg = 0;
                    x.pDmgForKill = skill.pDmgForKill[1];
                })
                .finish(),
            new With(new HeroQSkillComponent())
                .do(x => {
                    x.level = 1;
                })
                .finish()
        ]);
        return this;
    }
    /**
     * @param {Victor} position 
     * @param {number} deep 
     */
    createGoblinMinion(position, deep) {
        this.entities.push([
            new With(new AutoAttackComponent())
                .do(x => {
                    x.targetId = null;
                })
                .finish(),
            new TypeComponent()
                .setup({
                    typeName: config.beingTypes.goblinMinion,
                }),
            new TeamComponent()
                .setup({
                    teamName: config.teams.goblins,
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
            new With(new CharacteristicsComponent())
                .do(x => {
                    const hp = randint(...config.goblinMinionStats.healthPoints);
                    const hpPerLvl = randint(...config.goblinMinionStats.healthPointsPerLevel);
                    x.healthPoints = {
                        current: hp,
                        base: hp,
                        bonus: 0,
                        total: hp,
                        perLevel: hpPerLvl,
                    };
                    const pDmg = randint(...config.goblinMinionStats.physicalDamage);
                    const pDmgPerLvl = randint(...config.goblinMinionStats.physicalDamagePerLevel);
                    x.physicalDamage = {
                        current: pDmg,
                        base: pDmg,
                        bonus: 0,
                        total: 0,
                        perLevel: pDmgPerLvl,
                    };
                })
                .finish(),
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
            new With(new TypeComponent())
                .do(x => x.typeName = config.beingTypes.stairs)
                .finish(),
            new With(new StairsComponent())
                .do(x => x.toDeep = toDeep)
                .finish(),
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
