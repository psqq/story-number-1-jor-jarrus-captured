import * as ecs from "./ecs";
import * as c from "./components";
import App from "./app";
import config from "./config";
import Victor from "victor";

export default class BaseSystem extends ecs.System {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super();
        this.app = app;
        this.dispaly = app.display;
    }
    /**
     * @param {ecs.Entity} e 
     */
    drawGlyph(e) {
        const g = e.get(c.Glyph);
        const pos = e.get(c.Position);
        this.dispaly.draw(pos.x, pos.y, g.symbol, g.fgColor, g.bgColor);
    }
    /**
     * @param {ecs.Entity} e 
     * @param {number} deltaTime
     */
    canMove(e) {
        const w = config.map.size.x;
        const h = config.map.size.y;
        const pos = e.get(c.Position);
        const dir = e.get(c.MoveDirection);
        if (!pos || !dir) {
            return false;
        }
        const newPos = new Victor().copy(pos).add(dir);
        if (newPos.x < 0 || newPos.x >= w || newPos.y < 0 || newPos.y >= h) {
            return false;
        }
        return true;
    }
    /**
     * @param {ecs.Entity} e 
     * @param {number} deltaTime
     */
    tryMove(e, deltaTime) {
        if (deltaTime <= 0) {
            return false;
        }
        if (!this.canMove(e)) {
            return false;
        }
        const pos = e.get(c.Position);
        const dir = e.get(c.MoveDirection);
        pos.x += dir.x;
        pos.y += dir.y;
        return true;
    }
}
