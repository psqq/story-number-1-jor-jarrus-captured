import Scene from './scene';
import App from '../app';
import messages from '../messages';
import config from '../config';
import { el, list, mount, text, unmount } from "redom";

export default class LoseScene extends Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(config.screens.lose.elementSelector);
    }

    start() {
        super.start();
        this.draw();
    }

    /**
     * Draw screen.
     */
    draw() {
        const _ = messages.gettext.bind(messages);
        if (this.loseEl) {
            unmount(this.el, this.loseEl);
        }
        this.loseEl = el("div", [
            el("pre", [
                text(_(config.messages.enLoseScreenText))
            ]),
            el("hr"),
            this.backEl = el("span.text-button", [
                text(_('Main menu'))
            ]),
        ]);
        this.backEl.onclick = () => {
            this.switchTo(this.app.menuScene);
        };
        mount(this.el, this.loseEl);
    }
    /**
     * @param {Event} event
     */
    handleEvent(event) {
    }
}
