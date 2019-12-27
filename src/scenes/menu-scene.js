import Scene from './scene';
import App from '../app';
import getDirectionByKeyboardEvent from '../tools/get-direction-by-keyboard-event';
import config from '../config';
import messages from '../messages';
import textToOneLineString from '../tools/text-to-one-line-string';

export default class MenuScene extends Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        /** @type {number} */
        this.selected = 1;
        this.locales = ["en", "ru"];
        this.choosedLocale = this.locales.indexOf(messages.getLocale());
        this.menuItems = {
            changName: "Change name",
            startNewGame: "Start new game",
            continue: "Continue",
            save: "Save",
            load: "Load",
            changeLanguage: "Change language",
            help: "Help",
        };
        this.menuList = [];
        for(let key in this.menuItems) {
            this.menuList.push(this.menuItems[key]);
        }
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
        this.app.display.clear();
        let y = 0;
        this.app.display.drawText(
            0, y,
            messages.gettext('Welcome to game') + `, ${this.app.userName}!`
        );
        y++;
        this.app.display.drawText(0, y,
            `${messages.gettext('Current deep:')} ${this.app.baseSystem.getPlayerDeep()}`
        );
        y += 2;
        this.app.display.drawText(
            0, y,
            messages.gettext('Main menu:')
        );
        let i = 1;
        y += 2;
        for (let menuItem of this.menuList) {
            let s = `${i}. ${menuItem}`;
            if (menuItem == this.menuItems.load) {
                const userName = localStorage.getItem('userName');
                const deep = localStorage.getItem('deep');
                const date = localStorage.getItem('date');
                if (!userName || !deep || !date) {
                    s += ': no saved games';
                } else {
                    s += `: ${userName} (deep: ${deep}) ${date}`;
                }
            }
            if (menuItem == this.menuItems.changeLanguage) {
                s += `. Current: ${messages.getLocale()}`;
            }
            this.app.display.drawText(3, y, s);
            y++;
            i++;
        }
        this.app.display.draw(1, 4 + this.selected, '*', 'white', 'black');
        let menuScreenMsg = '';
        menuScreenMsg = textToOneLineString(messages.gettext(config.messages.enSotryMessage));
        menuScreenMsg += '\n\n' + messages.gettext(config.messages.enPurposeMsg);
        y += 2;
        this.app.display.drawText(0, y, menuScreenMsg);
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
            if (this.selected < 1){
                this.selected = this.menuList.length;
            }
            if (this.selected > this.menuList.length){
                this.selected = 1;
            }
            this.selected = Math.max(1, Math.min(this.menuList.length, this.selected));
            this.draw();
        }
    }
}
