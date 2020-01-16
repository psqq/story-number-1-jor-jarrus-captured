import * as ecs from "./ecs";
import * as c from "./components";
import App from "./app";

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
}
