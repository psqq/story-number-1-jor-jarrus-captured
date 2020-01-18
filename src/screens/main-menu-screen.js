import Screen from "./screen";
import messages from "../messages";
import { doWith } from "../tools";
import { el, mount, text, unmount } from "redom";
import config from "../config";

const _ = messages.gettext.bind(messages);

export default class MainMenuScreen extends Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(".main-menu");
        this.locales = ["en", "ru"];
    }
    draw() {
        if (this.menuEl) {
            unmount(this.el, this.menuEl);
        }
        // Check saved game
        let loadStatus = "no saved games";
        if (localStorage.getItem('game')) {
            const userName = localStorage.getItem('userName');
            const date = localStorage.getItem('date');
            loadStatus = `${userName} (${date})`;
        }
        // Make HTML menu
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
            el("h2", [
                text(_("Main menu"))
            ]),
            el("ol", [
                doWith(el("li.text-button", [
                    text(_("Change name"))
                ]), el => {
                    el.onclick = e => {
                        let newName = prompt(_("Enter your name"));
                        this.app.userName = newName;
                        this.draw();
                    };
                }),
                doWith(el("li.text-button", [
                    text(_("Start new game"))
                ]), el => {
                    el.onclick = e => {
                        this.app.game.createNewGame();
                        this.switchTo(this.app.game.scr.game);
                    };
                }),
                doWith(el("li.text-button", [
                    text(_("Continue"))
                ]), el => {
                    el.onclick = e => {
                        this.switchTo(this.app.game.scr.game);
                    };
                }),
                doWith(el("li.text-button", [
                    text(_("Save"))
                ]), el => {
                    el.onclick = e => {
                        this.app.saveApp();
                        this.draw();
                    };
                }),
                doWith(el("li.text-button", [
                    text(_("Load") + " - " + loadStatus)
                ]), el => {
                    el.onclick = e => {
                        this.app.loadApp();
                        this.draw();
                    };
                }),
                doWith(el("li.text-button", [
                    text(_("Change language") + ' (Change language)')
                ]), el => {
                    el.onclick = e => {
                        let s = new Set(this.locales);
                        let curLocale = messages.getLocale();
                        s.delete(curLocale);
                        this.app.setLocale(s.values().next().value);
                        this.draw();
                    };
                }),
                doWith(el("li.text-button", [
                    text(_("Help"))
                ]), el => {
                    el.onclick = e => {
                        this.switchTo(this.app.game.scr.help);
                    };
                }),
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
