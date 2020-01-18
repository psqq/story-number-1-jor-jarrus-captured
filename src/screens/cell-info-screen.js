import Screen from "./screen";
import messages from "../messages";
import { el, mount, text, unmount } from "redom";
import config from "../config";
import Victor from "victor";
import * as ecs from "../ecs";
import * as c from "../components";

const _ = messages.gettext.bind(messages);

export default class CellInfoScreen extends Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(".cell-info-screen");
        this.position = new Victor();
    }
    /**
     * 
     * @param {ecs.Entity} e 
     */
    getInfoAboutEntity(e) {
        const elements = [];
        const typeComp = e.get(c.Type);
        if (typeComp) {
            const s = _(typeComp.typeName);
            elements.push(el("h3", [
                text(s + ":")
            ]));
        } else {
            return;
        }
        const statsComp = e.get(c.Stats);
        if (statsComp) {
            const c = statsComp;
            const hp = c.healthPoints.current;
            const maxHp = c.healthPoints.total;
            const percent = Math.floor(maxHp / hp * 100);
            elements.push(el("pre", [
                text(_("Helath points") + `: ${hp} / ${maxHp} - ${percent}%`)
            ]));
        } else {
            return;
        }
        return el("div", elements);
    }
    draw() {
        if (this.contentEl) {
            unmount(this.el, this.contentEl);
        }
        // Make content of screen
        const elements = [
            el("h2", [
                text(_("Cell information"))
            ]),
            el("p", [
                text(
                    _("Info about position with coordinates ")
                    + `(${this.position.x}, ${this.position.y}):`
                )
            ]),
        ];
        const entitiesInThisPosition = this.app.game.bs.getEntitiesByPosition(this.position);
        for (let e of entitiesInThisPosition) {
            const infoEl = this.getInfoAboutEntity(e);
            if (infoEl) {
                elements.push(infoEl);
            }
        }
        this.contentEl = el("div", elements);
        mount(this.el, this.contentEl);
    }
    open() {
        super.open();
        this.draw();
    }
    handleEvent(e) {
        if (e instanceof KeyboardEvent) {
            if (e.key == "Escape") {
                this.back();
                return;
            }
        }
    }
}
