import App from "../app";
import Victor from "victor";

export default class Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        this.previousScene = null;
        /** @type {Victor} */
        this.mouseMovePosition = null;
        /** @type {HTMLDivElement} */
        this.el = null;
    }
    bindEvents() {}
    unbindEvents() {}
    start() {
        if (this.el) {
            this.el.style.display = 'block';
        }
        this.app.currentScene = this;
        window.addEventListener('keydown', this);
        window.addEventListener('mousemove', this);
        window.addEventListener('mousedown', this);
        window.addEventListener('mouseup', this);
    }
    draw() { }
    finish() {
        if (this.el) {
            this.el.style.display = 'none';
        }
    }
    /**
     * @param {Event} event 
     */
    handleEvent(event) {
        if (event.type === 'mousemove') {
            const eventX = this.app.display.eventToPosition(event)[0];
            const eventY = this.app.display.eventToPosition(event)[1];
            this.mouseMovePosition = new Victor(eventX, eventY);
        }
    }
    /**
     * @param {Scene} scene
     */
    switchTo(scene) {
        this.finish();
        scene.previousScene = this;
        window.removeEventListener('keydown', this);
        window.removeEventListener('mousemove', this);
        window.removeEventListener('mousedown', this);
        window.removeEventListener('mouseup', this);
        this.unbindEvents();
        scene.start();
    }
    back() {
        this.switchTo(this.previousScene);
    }
}
