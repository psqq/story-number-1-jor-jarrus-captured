import Component from "../core/component"
import Digger from "rot-js/lib/map/digger";
import config from "../config";
import DungeonComponent from "./components/dungeon-component";
import Engine from "../core/engine";

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
        let map = new Map<string, string>();
        for (let x = 0; x < config.map.size.x; x++) {
            for (let y = 0; y < config.map.size.y; y++) {
                map.set(`${x},${y}`, '#');
            }
        }
        let mapDigger = new Digger(config.map.size.x, config.map.size.y);
        mapDigger.create((x, y, value) => {
            if (value) {
                map.set(`${x},${y}`, '#');
            } else {
                map.set(`${x},${y}`, '.');
            }
        });
        this.entities.push([
            new DungeonComponent(map)
        ]);
        return this;
    }
}