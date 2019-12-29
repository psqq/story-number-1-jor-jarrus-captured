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
        this.choosedLocale = this.locales.indexOf(messages.getLocale());
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
        this.menuEl = el("div.main-menu-list", [
            el("h3", [
                text(_("Main menu"))
            ]),
            el("ol", [
                this.changeNameEl = el("li", [
                    text(_("Change name"))
                ]),
                this.startNewGameEl = el("li", [
                    text(_("Start new game"))
                ]),
                this.ContinueEl = el("li", [
                    text(_("Continue"))
                ]),
                this.saveEl = el("li", [
                    text(_("Save"))
                ]),
                this.loadEl = el("li", [
                    text(_("Load"))
                ]),
                this.changeLangEl = el("li", [
                    text(_("Change language"))
                ]),
                this.helpEl = el("li", [
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
        this.changeLangEl.onclick = () => {
            this.changeLanguage(1);
            this.draw();
        };
        mount(this.el, this.menuEl);
    }
    /**
     * Handles the keydown and mousedown events of this scene.
     * @param {Event} event
     */
    handleEvent(event) {
        if (event.type === 'keydown') {
            /** @type {KeyboardEvent} */
            const keyboardEvent = event;
            if (keyboardEvent.code === 'Enter') {
                if (this.menuList[this.selected - 1] === this.menuItems.changName) {
                    let newName = prompt("Enter your name");
                    this.app.userName = newName;
                    this.draw();
                    return;
                }
                if (this.menuList[this.selected - 1] === this.menuItems.startNewGame) {
                    this.app.startNewGame();
                    this.switchTo(this.app.gameScene);
                    return;
                }
                if (this.menuList[this.selected - 1] === "Continue") {
                    this.switchTo(this.app.gameScene);
                    return;
                }
                if (this.menuList[this.selected - 1] === "Save") {
                    this.app.saveGame();
                    this.draw();
                    return;
                }
                if (this.menuList[this.selected - 1] === "Load") {
                    this.app.loadGame();
                    this.draw();
                    return;
                }
                if (this.menuList[this.selected - 1] === "Help") {
                    this.switchTo(this.app.helpScene);
                    return;
                }
            }
            const direction = getDirectionByKeyboardEvent(keyboardEvent);
            if (!direction) {
                return;
            }
            if (this.menuList[this.selected - 1] === this.menuItems.changeLanguage) {
                if (direction.x != 0) {
                    this.changeLanguage(direction.x);
                    this.draw();
                    return;
                }
            }
            this.selected += direction.y;
            if (this.selected < 1) {
                this.selected = this.menuList.length;
            }
            if (this.selected > this.menuList.length) {
                this.selected = 1;
            }
            this.selected = Math.max(1, Math.min(this.menuList.length, this.selected));
            this.draw();
        }
    }
}
