import Scene from './scene';
import App from '../app';
import messages from '../messages';
import config from '../config';
import { el, list, mount, text, unmount } from "redom";

export default class HelpScene extends Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(config.screens.help.elementSelector);
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
        if (this.helpEl) {
            unmount(this.el, this.helpEl);
        }
        this.helpEl = el("div", [
            el("h3", [
                text(_("Help"))
            ]),
            el("pre", [
                text(_(config.messages.enHelpScreenText))
            ]),
            this.backEl = el("span.text-button", [
                text(_('Back'))
            ]),
        ]);
        this.backEl.onclick = () => {
            this.back();
        };
        mount(this.el, this.helpEl);
    }
    /**
     * @param {Event} event
     */
    handleEvent(event) {
    }
}
