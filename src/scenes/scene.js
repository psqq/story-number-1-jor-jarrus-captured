import App from "../app";

export default class Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        this.previousScene = null;
    }
    start() {
        window.addEventListener('keydown', this);
        window.addEventListener('mousedown', this);
        window.addEventListener('mouseup', this);
    }
    draw() { }
    finish() { }
    /**
     * @param {Event} event 
     */
    handleEvent(event) { }
    /**
     * @param {Scene} scene
     */
    switchTo(scene) {
        this.finish();
        scene.previousScene = this;
        window.removeEventListener('keydown', this);
        window.removeEventListener('mousedown', this);
        window.removeEventListener('mouseup', this);
        scene.start();
    }
    back() {
        this.switchTo(this.previousScene);
    }
}
