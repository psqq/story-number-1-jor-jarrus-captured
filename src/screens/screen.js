import App from "../app";

export default class Screen {
    /**
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        this.events = [
            "keydown",
        ];
        this.previousScreen = null;
    }
    bindEvents() {
        for (let event of this.events) {
            window.addEventListener(event, this);
        }
    }
    unbindEvents() {
        for (let event of this.events) {
            window.removeEventListener(event, this);
        }
    }
    open() {
        this.bindEvents();
    }
    close() {
        this.unbindEvents();
    }
    /**
     * @param {Event} event 
     */
    handleEvent(event) {
    }
    /**
     * @param {Screen} screen
     */
    switchTo(screen) {
        this.close();
        screen.previousScene()
        screen.open();
    }
    back() {
        this.switchTo(this.previousScene);
    }
}
