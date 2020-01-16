import * as ecs from "./ecs";
import * as entities from "./entities";
import * as c from "./components";
import * as s from "./systems";
import App from "./app";

export default class Game {
    /**
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        /** @type {ecs.Engine} */
        this.engine = null;
        /** @type {ecs.Entity} */
        this.player = null;
        this.pause = true;
        this.displaySystems = [];
    }
    init() {
        this.engine = new ecs.Engine();
        this.displaySystems = [
            new s.DisplayGlyph(this.app),
        ];
        for (let system of this.displaySystems) {
            this.engine.addSystem(system);
        }
        this.pause = false;
    }
    createNewGame() {
        this.pause = true;
        this.engine.clearEntities();
        this.player = this.engine.createEntity(...entities.createPlayer());
        this.pause = false;
    }
    draw() {
        this.app.display.clear();
        this.engine.update(this.displaySystems, this.engine.getAllEntities(), 0);
    }
    mainloop() {
        const go = () => {
            if (this.pause) {
                return;
            }
            // Update only if player need it
            if (this.player.isNeedUpdate()) {
                // First update player
                this.engine.update(
                    this.engine.getAllSystems(),
                    [this.player],
                    1,
                );
                // Next update other entities
                const notPlayers = [];
                for(let e of this.engine.getAllEntities()) {
                    if (!e.get(c.Player)) {
                        notPlayers.push(e);
                    }
                }
                this.engine.update(
                    this.engine.getAllSystems(),
                    notPlayers,
                    1,
                );
            }
            // Draw all
            this.draw();
            requestAnimationFrame(go);
        };
        requestAnimationFrame(go);
    }
}
