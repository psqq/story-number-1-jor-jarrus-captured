import Component from "../core/component"
import Digger from "rot-js/lib/map/digger";
import config from "../config";
import DungeonComponent from "./components/dungeon-component";
import Engine from "../core/engine";
import PositionComponent from "./components/position-component";
import GlyphComponent from "./components/glyph-component";
import Victor = require("victor");
import PlayerComponent from "./components/player-component";
import MoveDirectionComponent from "./components/move-direction-component";
import FovComponent from "./components/fov-component";
import StairsComponent from "./components/stairs-component";
import popRandomElement from "../tools/pop-random-element copy";
import MemorizedFovAreaComponent from "./components/memorized-fov-area-component";
import matrix from "../tools/matrix";
import ExperienceLevelComponent from "./components/experience-level-component";
import PhysicalDamageComponent from "./components/physical-damage-component";
import HealthPointsComponent from "./components/health-points-component";
import ObstacleComponent from "./components/obstacle-component";

export default class EntitiesBuilder {
    entities: Component[][];
    constructor() {
        this.entities = [];
    }
    addCreatedEntitiesToEngine(engine: Engine) {
        for (let components of this.entities) {
            engine.createEntity(...components);
        }
        this.entities = [];
        return this;
    }
    createDungeon(deep: number) {
        const map: string[][] = [];
        const floorPositions: Victor[] = [];
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
            new DungeonComponent().setMap(map).setDeep(deep)
        ]);
        const stairsDownPosition = popRandomElement(floorPositions);
        this.createStairs(stairsDownPosition, deep, 1);
        const stairsUpPosition = popRandomElement(floorPositions);
        this.createStairs(stairsUpPosition, deep, -1);
        const n = 3 + Math.random() * 10;
        for (let i = 0; i < n; i++) { 
            this.createEnemy(popRandomElement(floorPositions), deep);
        }
        return this;
    }
    createPlayer(position: Victor, deep: number) {
        this.entities.push([
            new ObstacleComponent(),
            new FovComponent()
                .setFov(matrix(config.map.size.x, config.map.size.y, false)),
            new PlayerComponent(),
            new MoveDirectionComponent(),
            new MemorizedFovAreaComponent()
                .setMemorizedFovArea(
                    matrix(config.map.size.x, config.map.size.y, false)
                )
                .setDeep(deep),
            new PositionComponent()
                .setX(position.x)
                .setY(position.y)
                .setDeep(deep),
            new GlyphComponent()
                .setSymbol('@')
                .setFgColor('white')
                .setZLevel(500),
            new ExperienceLevelComponent()
                .setup({
                    level: 1,
                    currentExperience: 0,
                    nextLevelExperience: 100,
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
    createEnemy(position: Victor, deep: number) {
        this.entities.push([
            new ObstacleComponent(),
            new PositionComponent()
                .setX(position.x)
                .setY(position.y)
                .setDeep(deep),
            new GlyphComponent()
                .setSymbol('g')
                .setFgColor('green')
                .setZLevel(500),
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
    createStairs(position: Victor, deep: number, depthChange: number) {
        this.entities.push([
            new StairsComponent()
                .setDepthChange(depthChange),
            new PositionComponent()
                .setX(position.x)
                .setY(position.y)
                .setDeep(deep),
            new GlyphComponent()
                .setSymbol(depthChange > 0 ? '>' : '<')
                .setFgColor('white')
                .setZLevel(400)
        ]);
        return this;
    }
}
