import Scene from './scene';
import App from '../app';
import getDirectionByKeyboardEvent from '../tools/get-direction-by-keyboard-event';
import config from '../config';

/**
 * Represents the scene that displays the menu.
 */
export default class MenuScene extends Scene {
    private selected: number;
    private menu: string[];

    constructor(app: App) {
        super(app);
        this.selected = 1;
        this.menu = ["Start", "Help"];
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
        this.app.display.drawText(0, 0, 'Welcome to game!');
        this.app.display.drawText(0, 2, 'Main menu:');
        let i = 1;
        for(let menuItem of this.menu) {
            let s = `${i}. ${menuItem}`;
            this.app.display.drawText(3, 3 + i, s);
            i++;
        }
        this.app.display.draw(1, 3 + this.selected, '*', 'white', 'black');
        this.app.display.drawText(0, 7, config.menuScreenMsg);
    }

    /**
     * Handles the keydown and mousedown events of this scene.
     * @param event
     */
    handleEvent(event: Event) {
        if (event.type === 'keydown') {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.code === 'Enter') {
                if (this.selected === 1) {
                    this.switchTo(this.app.gameScene);
                }
                if (this.selected === 2) {
                    this.switchTo(this.app.helpScene);
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
