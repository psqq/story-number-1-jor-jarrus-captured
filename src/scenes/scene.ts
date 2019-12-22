import App from "../app";

/**
 * Represents the scene that displays the content of the game.
 */
export default class Scene {
    protected app: App;
    protected previousScene: Scene;

    /**
     * Creates an instance of Scene.
     * @param app 
     */
    constructor(app: App) {
        this.app = app;
        this.previousScene = null;
    }

    /**
     * Opens the scene and starts listening to the events over it.
     */
    start() {
        window.addEventListener('keydown', this);
        window.addEventListener('mousedown', this);
        window.addEventListener('mouseup', this);
    }

    /**
     * Draw screen.
     */
    draw() {
    }

    /**
     * Close the scene.
     */
    finish() {
    }

    /**
     * Handles the events of this scene.
     * @param event 
     */
    handleEvent(event: Event) {
    }

    /**
     * Start the specified scene and stops the current one.
     *
     * @param {Scene} scene
     * @memberof MenuScene
     */
    switchTo(scene: Scene) {
        this.finish();
        scene.previousScene = this;
        window.removeEventListener('keydown', this);
        window.removeEventListener('mousedown', this);
        window.removeEventListener('mouseup', this);
        scene.start();
    }

    /**
     * Back to privouse scene.
     */
    back() {
        this.switchTo(this.previousScene);
    }
}
