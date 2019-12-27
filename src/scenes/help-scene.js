import Scene from './scene';
import App from '../app';
import messages from '../messages';
import config from '../config';

export default class HelpScene extends Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
    }

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
            0, 0,
            messages.gettext(config.messages.enHelpScreenText)
        );
    }
    /**
     * @param {Event} event
     */
    handleEvent(event) {
        if (event.type === 'keydown') {
            /** @type {KeyboardEvent} */
            const keyboardEvent = event;
            if (keyboardEvent.code === 'Enter') {
                this.back();
            }
        }
    }
}
