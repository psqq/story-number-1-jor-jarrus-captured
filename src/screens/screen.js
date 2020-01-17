import App from "../app";
import EventEmitter from "wolfy87-eventemitter";

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
        /** @type {HTMLDivElement} */
        this.el = null;
        this.ee = new EventEmitter();
    }
    show() {
        if (!this.el) {
            return;
        }
        this.el.style.display = "block";
    }
    hide() {
        if (!this.el) {
            return;
        }
        this.el.style.display = "none";
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
        this.show();
        this.ee.emit("open");
    }
    close() {
        this.unbindEvents();
        this.hide();
        this.ee.emit("close");
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
