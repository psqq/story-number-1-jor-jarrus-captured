import Screen from "./screen";
import messages from "../messages";
import { doWith } from "../tools";
import { el, list, mount, text, unmount } from "redom";
import config from "../config";

const _ = messages.gettext.bind(messages);

export default class MainMenuScreen extends Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(".main-menu");
    }
    draw() {
        if (this.menuEl) {
            unmount(this.el, this.menuEl);
        }
        let loadStatus = "no saved games";
        this.menuEl = el("div.main-menu-list", [
            el("p.story-msg", [
                text(_('Welcome to game') + `, `),
                el("b", [
                    text(`${this.app.userName}`)
                ]),
                text('!'),
            ]),
            // el("p.story-msg", [
            //     text(`${_('Current deep:')} ${this.app.baseSystem.getPlayerDeep()}`)
            // ]),
            el("h3", [
                text(_("Main menu"))
            ]),
            el("ol", [
                doWith(el("li.text-button", [
                    text(_("Change name"))
                ]), el => {
                    el.onclick = e => {
                    }
                }),
                this.startNewGameEl = el("li.text-button", [
                    text(_("Start new game"))
                ]),
                this.continueEl = el("li.text-button", [
                    text(_("Continue"))
                ]),
                this.saveEl = el("li.text-button", [
                    text(_("Save"))
                ]),
                this.loadEl = el("li.text-button", [
                    text(_("Load") + loadStatus)
                ]),
                this.changeLangEl = el("li.text-button", [
                    text(_("Change language") + ' (Change language)')
                ]),
                this.helpEl = el("li.text-button", [
                    text(_("Help"))
                ]),
            ]),
            el("p.story-msg", [
                text(_(config.messages.enSotryMessage))
            ]),
            el("p.story-msg", [
                text(_(config.messages.enPurposeMessage))
            ]),
        ]);
        mount(this.el, this.menuEl);
    }
    open() {
        super.open();
        this.draw();
    }
}
