import Scene from './scene';
import App from '../app';
import getDirectionByKeyboardEvent from '../tools/get-direction-by-keyboard-event';
import config from '../config';
import messages from '../messages';
import textToOneLineString from '../tools/text-to-one-line-string';

/**
 * Represents the scene that displays the menu.
 */
export default class MenuScene extends Scene {
    private selected: number;
    private menu: string[];

    constructor(app: App) {
        super(app);
        this.selected = 1;
        this.menu = ["Change name", "Start or Continue", "Save", "Load", "Help"];
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
        this.app.display.drawText(0, y, `Current deep: ${this.app.baseSystem.getCurrentDeep()}`);
        y += 2;
        this.app.display.drawText(0, y, 'Main menu:');
        let i = 1;
        y += 2;
        for (let menuItem of this.menu) {
            let s = `${i}. ${menuItem}`;
            if (menuItem == "Load") {
                const userName = localStorage.getItem('userName');
                const deep = localStorage.getItem('deep');
                const date = localStorage.getItem('date');
                if (!userName || !deep || !date) {
                    s += ': no saved games';
                } else {
                    s += `: ${userName} (deep: ${deep}) ${date}`;
                }
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
     * @param event
     */
    handleEvent(event: Event) {
        if (event.type === 'keydown') {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.code === 'Enter') {
                if (this.menu[this.selected - 1] === "Change name") {
                    let newName = prompt("Enter your name");
                    this.app.userName = newName;
                    this.draw();
                    return;
                }
                if (this.menu[this.selected - 1] === "Start or Continue") {
                    this.switchTo(this.app.gameScene);
                    return;
                }
                if (this.menu[this.selected - 1] === "Save") {
                    this.app.saveGame();
                    this.draw();
                    return;
                }
                if (this.menu[this.selected - 1] === "Load") {
                    this.app.loadGame();
                    this.draw();
                    return;
                }
                if (this.menu[this.selected - 1] === "Help") {
                    this.switchTo(this.app.helpScene);
                    return;
                }
            }
            const direction = getDirectionByKeyboardEvent(keyboardEvent);
            if (!direction) {
                return;
            }
            this.selected += direction.y;
            this.selected = Math.max(1, Math.min(this.menu.length, this.selected));
            this.draw();
        }
    }
}
