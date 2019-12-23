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
        return this;
    }
    createPlayer(position: Victor, deep: number) {
        this.entities.push([
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
                })
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
