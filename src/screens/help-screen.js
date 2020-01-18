import Screen from "./screen";
import messages from "../messages";
import { el, mount, text, unmount } from "redom";
import config from "../config";

const _ = messages.gettext.bind(messages);

export default class HelpScreen extends Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(".help-screen");
    }
    draw() {
        if (this.contentEl) {
            unmount(this.el, this.contentEl);
        }
        // Make help
        this.contentEl = el("div", [
            el("h3", [
                text(_("Help"))
            ]),
            el("pre", [
                text(_(config.messages.enHelpScreenText))
            ]),
        ]);
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
