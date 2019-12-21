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

export default class EntitiesBuilder {
    entities: Component[][];
    constructor() {
        this.entities = [];
    }
    addCreatedEntitiesToEngine(engine: Engine) {
        for(let components of this.entities) {
            engine.createEntity(...components);
        }
        this.entities = [];
        return this;
    }
    createDungeon() {
        let map: string[][] = [];
        for (let x = 0; x < config.map.size.x; x++) {
            map[x] = [];
            for (let y = 0; y < config.map.size.y; y++) {
                map[x][y] = config.map.wall.symbol;
            }
        }
        let mapDigger = new Digger(config.map.size.x, config.map.size.y);
        mapDigger.create((x, y, value) => {
            if (value) {
                map[x][y] = config.map.wall.symbol;
            } else {
                map[x][y] = config.map.floor.symbol;
            }
        });
        this.entities.push([
            new DungeonComponent().setMap(map)
        ]);
        return this;
    }
    createPlayer(position: Victor) {
        this.entities.push([
            new FovComponent(),
            new PlayerComponent(),
            new MoveDirectionComponent(),
            new PositionComponent().setX(position.x).setY(position.y),
            new GlyphComponent().setSymbol('@').setFgColor('white')
        ]);
        return this;
    }
}
