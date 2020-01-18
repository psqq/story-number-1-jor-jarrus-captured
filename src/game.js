import * as ecs from "./ecs";
import * as entities from "./entities";
import * as c from "./components";
import * as s from "./systems";
import App from "./app";
import GameScreen from "./screens/game-screen";
import BaseSystem from "./base-system";
import MainMenuScreen from "./screens/main-menu-screen";
import HelpScreen from "./screens/help-screen";
import CellInfoScreen from "./screens/cell-info-screen";
import ArenasWorld from "./worlds/arenas";

export default class Game {
    /**
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        /** @type {ecs.Engine} */
        this.engine = null;
        /** @type {BaseSystem} */
        this.bs = null;
        /** @type {ecs.Entity} */
        this.player = null;
        this.pause = true;
        this.running = false;
        this.gameSystems = [];
        this.displaySystems = [];
        this.scr = {
            game: new GameScreen(this.app),
            mainMenu: new MainMenuScreen(this.app),
            help: new HelpScreen(this.app),
            cellInfo: new CellInfoScreen(this.app),
        };
        this.scr.game.ee.on("open", () => {
            this.pause = false;
            this.draw();
        });
        this.scr.game.ee.on("close", () => {
            this.pause = true;
        });
        this.time = 0;
        this.world = new ArenasWorld(this.app);
    }
    toString() {
        const data = {};
        data.engine = this.engine.toString();
        data.pause = this.pause;
        data.running = this.running;
        data.time = this.time;
        return JSON.stringify(data);
    }
    fromString(s) {
        const data = JSON.parse(s);
        this.engine.fromString(data.engine);
        this.pause = data.pause;
        this.running = data.running;
        this.time = data.time;
        this.player = this.engine.getEntities(c.Player)[0];
    }
    init() {
        this.engine = new ecs.Engine();
        this.engine.registerComponentClasses([
            c.AutoAttack,
            c.Stats,
            c.Damage,
            c.Deep,
            c.DepthMoving,
            c.Dungeon,
            c.ExperienceLevel,
            c.Fov,
            c.Glyph,
            c.HealthPoints,
            c.HeroQSkill,
            c.HealthPoints,
            c.MemorizedFovArea,
            c.MoveDirection,
            c.Obstacle,
            c.Player,
            c.Position,
            c.Shield,
            c.HeroPassive,
            c.SimpleAi,
            c.Stairs,
            c.Enemy,
            c.Type,
        ]);
        // Init base system
        this.bs = new BaseSystem(this.app);
        this.engine.addSystem(this.bs);
        // Init other game systems
        this.gameSystems = [
            new s.Stats(this.app),
            new s.Moving(this.app),
        ];
        for (let system of this.gameSystems) {
            this.engine.addSystem(system);
        }
        // Init display systems
        this.displaySystems = [
            new s.DisplayGlyph(this.app),
        ];
        for (let system of this.displaySystems) {
            this.engine.addSystem(system);
        }
        // Open menu screen
        this.scr.mainMenu.open();
        this.scr.game.addMsg('Welcome to game!');
    }
    createNewGame() {
        this.pause = true;
        this.engine.clearEntities();
        this.world.createNewGame(this.engine);
        this.player = this.engine.getEntities(c.Player)[0];
        // Update stats
        this.engine.update(
            this.gameSystems,
            this.engine.getAllEntities(),
            0,
        );
    }
    draw() {
        this.app.display.clear();
        this.engine.update(this.displaySystems, this.engine.getAllEntities(), 0);
        this.scr.game.draw();
    }
    mainloop() {
        if (this.running) {
            return;
        }
        this.running = true;
        const go = () => {
            if (!this.pause) {
                // Update only if player need it
                if (this.player && this.player.isNeedUpdate()) {
                    // Prepare for update
                    this.engine.update(
                        this.gameSystems,
                        this.engine.getAllEntities(),
                        0,
                    );
                    // Updae if realy need
                    if (this.player.isNeedUpdate()) {
                        // First update player
                        this.engine.update(
                            this.gameSystems,
                            [this.player],
                            1,
                        );
                        // Next update other entities
                        const notPlayers = [];
                        for (let e of this.engine.getAllEntities()) {
                            if (!e.get(c.Player)) {
                                notPlayers.push(e);
                            }
                        }
                        this.engine.update(
                            this.gameSystems,
                            notPlayers,
                            1,
                        );
                        this.time++;
                    }
                }
                // Draw all
                this.draw();
            }
            requestAnimationFrame(go);
        };
        requestAnimationFrame(go);
    }
}
