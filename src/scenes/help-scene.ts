import Scene from './scene';
import App from '../app';

/**
 * Represents the scene that displays the menu.
 */
export default class MenuScene extends Scene {

    constructor(app: App) {
        super(app);
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
        this.app.display.drawText(
            0, 0, `Help

            Movement: hjklyubn, Numpad, Arrows
            Help: ?



            * back
            `
        );
    }

    /**
     * Handles the keydown and mousedown events of this scene.
     * @param event
     */
    handleEvent(event: Event) {
        if (event.type === 'keydown') {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.code === 'Enter') {
                this.back();
            }
        }
    }
}
