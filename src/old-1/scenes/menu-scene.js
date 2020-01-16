import Scene from './scene';
import App from '../app';
import getDirectionByKeyboardEvent from '../tools/get-direction-by-keyboard-event';
import config from '../config';
import messages from '../messages';
import textToOneLineString from '../tools/text-to-one-line-string';
import { el, list, mount, text, unmount } from "redom";

export default class MenuScene extends Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.el = document.querySelector(config.screens.mainMenu.elementSelector);
        this.locales = ["en", "ru"];
    }
    /**
     * @param {number} dx 
     */
    changeLanguage(dx) {
        this.choosedLocale += dx;
        if (this.choosedLocale < 0) {
            this.choosedLocale = this.locales.length - 1;
        }
        if (this.choosedLocale >= this.locales.length) {
            this.choosedLocale = 0;
        }
        this.app.setLocale(this.locales[this.choosedLocale]);
    }
    /**
     * Opens the menu scene.
     */
    start() {
        super.start();
        this.choosedLocale = this.locales.indexOf(messages.getLocale());
        this.draw();
    }
    /**
     * Draw screen.
     */
    draw() {
        const _ = messages.gettext.bind(messages);
        if (this.menuEl) {
            unmount(this.el, this.menuEl);
        }
        const userName = localStorage.getItem('userName');
        const deep = localStorage.getItem('deep');
        const date = localStorage.getItem('date');
        let loadStatus = '';
        if (!userName || !deep || !date) {
            loadStatus += ': ' + _("no saved games");
        } else {
            loadStatus += `: ${userName} (${_("deep:")} ${deep}) ${date}`;
        }
        this.menuEl = el("div.main-menu-list", [
            el("p.story-msg", [
                text(_('Welcome to game') + `, `),
                el("b", [
                    text(`${this.app.userName}`)
                ]),
                text('!'),
            ]),
            el("p.story-msg", [
                text(`${_('Current deep:')} ${this.app.baseSystem.getPlayerDeep()}`)
            ]),
            el("h3", [
                text(_("Main menu"))
            ]),
            el("ol", [
                this.changeNameEl = el("li.text-button", [
                    text(_("Change name"))
                ]),
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
                text(textToOneLineString(_(config.messages.enSotryMessage)))
            ]),
            el("p.story-msg", [
                text(textToOneLineString(_(config.messages.enPurposeMsg)))
            ]),
        ]);
        this.changeNameEl.onclick = () => {
            let newName = prompt("Enter your name");
            this.app.userName = newName;
            this.draw();
        };
        this.startNewGameEl.onclick = () => {
            this.app.startNewGame();
            this.switchTo(this.app.gameScene);
        };
        this.continueEl.onclick = () => {
            this.switchTo(this.app.gameScene);
        };
        this.saveEl.onclick = () => {
            this.app.saveGame();
            this.draw();
        };
        this.loadEl.onclick = () => {
            this.app.loadGame();
            this.draw();
        };
        this.changeLangEl.onclick = () => {
            this.changeLanguage(1);
            this.draw();
        };
        this.helpEl.onclick = () => {
            this.switchTo(this.app.helpScene);
        };
        mount(this.el, this.menuEl);
    }
    /**
     * Handles the keydown and mousedown events of this scene.
     * @param {Event} event
     */
    handleEvent(event) {
    }
}
