import * as c from "../components";
import * as ecs from "../ecs";
import { make } from "./tools";
import Arena from "rot-js/lib/map/arena";
import config from "./config";
import App from "../app";

export default class ArenasWorld {
    /**
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        this.game = this.app.game;
        this.engine = this.game.engine;
    }
    createNewGame() {
        const entities = [
            this.createPlayer(),
            this.createDungeon(),
        ];
        for(let e of entities) {
            this.engine.
        }
        this.engine.createEntity(...this.createPlayer());
        this.engine.createEntity(...this.createDungeon());
    }
    createPlayer() {
        return [
            make(c.Player, c => {
            }),
            make(c.Type, c => {
                c.typeName = 'player';
            }),
            make(c.Position, c => {
                c.x = 0;
                c.y = 0;
            }),
            make(c.Deep, c => {
                c.deep = 1;
            }),
            make(c.MoveDirection, c => {
                c.erase();
            }),
            make(c.Glyph, c => {
                c.fgColor = 'white';
                c.bgColor = 'black';
                c.symbol = '@';
                c.zLevel = 1000;
            }),
            make(c.Stats, c => {
                Object.assign(c.healthPoints, {
                    current: 100,
                    base: 100,
                    perLevel: 10,
                });
            })
        ];
    }
    /**
     * @param {number} deep 
     */
    createDungeon(deep) {
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
        const mapDigger = new Arena(config.map.size.x, config.map.size.y);
        mapDigger.create((x, y, value) => {
            if (value) {
                map[x][y] = config.map.wall.symbol;
            } else {
                map[x][y] = config.map.floor.symbol;
                floorPositions.push(new Victor(x, y));
            }
        });
        const components = [
            make(c.Dungeon, c => {
                c.map = map;
            }),
            make(c.Deep, c => {
                c.deep = deep;
            }),
        ];
        return components;
    }
}
