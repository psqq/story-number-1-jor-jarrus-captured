import Scene from './scene';
import App from '../app';
import getDirectionByKeyboardEvent from '../tools/get-direction-by-keyboard-event';
import PlayerComponent from '../game/components/player-component';
import MoveDirectionComponent from '../game/components/move-direction-component';
import EntitiesBuilder from '../game/entities-builder';
import PositionComponent from '../game/components/position-component';

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
                return;
            }
            if (keyboardEvent.key == '/' && keyboardEvent.shiftKey) {
                this.switchTo(this.app.helpScene);
                return;
            }
            const player = this.app.engine.getEntitiesOfTheseComponents(
                PlayerComponent, MoveDirectionComponent
            )[0];
            if (keyboardEvent.key == '>' && keyboardEvent.shiftKey) {
                player.get(MoveDirectionComponent).clear().setDepthChange(1);
                this.app.update();
                return;
            }
            if (keyboardEvent.key == '<' && keyboardEvent.shiftKey) {
                player.get(MoveDirectionComponent).clear().setDepthChange(-1);
                this.app.update();
                return;
            }
            const direction = getDirectionByKeyboardEvent(keyboardEvent);
            if (direction) {
                player.get(MoveDirectionComponent)
                    .clear()
                    .setX(direction.x)
                    .setY(direction.y);
                this.app.update();
                return;
            }
        }
    }
}
