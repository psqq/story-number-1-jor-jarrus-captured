import Scene from './scene';
import App from './app';
import getDirectionByKeyboardEvent from './get-direction-by-keyboard-event';
import PlayerComponent from './game/components/player-component';
import MoveDirectionComponent from './game/components/move-direction-component';

/**
 * Represents the scene that displays the menu.
 */
export default class GameScene extends Scene {

    constructor(app: App) {
        super(app);
    }

    /**
     * Opens the menu scene.
     */
    start() {
        super.start();
        this.app.update();
    }

    /**
     * Draw screen.
     */
    draw() {
    }

    /**
     * Handles the keydown and mousedown events of this scene.
     * @param event
     */
    handleEvent(event: Event) {
        if (event.type == 'keydown') {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.code === 'Escape') {
                this.switchTo(this.app.menuScene);
            }
            const direction = getDirectionByKeyboardEvent(keyboardEvent);
            if (!direction) {
                return;
            }
            const entity = this.app.engine.getEntitiesOfTheseComponents(
                PlayerComponent, MoveDirectionComponent
            )[0];
            entity.get(MoveDirectionComponent).setX(direction.x).setY(direction.y);
            this.app.update();
        }
    }
}
