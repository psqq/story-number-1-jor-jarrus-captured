import Scene from './scene';
import App from '../app';
import getDirectionByKeyboardEvent from '../tools/get-direction-by-keyboard-event';
import EntitiesBuilder from '../entities-builder';
import Position2DComponent from '../components/position-2d-component';
import TeamComponent from '../components/team-component';
import DepthMovingComponent from '../components/depth-moving-component';
import DeepComponent from '../components/deep-compnent';
import MoveDirection2DComponent from '../components/move-direction-2d-component';

/**
 * Represents the scene that displays the menu.
 */
export default class GameScene extends Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
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
    draw() { }
    /**
     * @param {Event} event
     */
    handleEvent(event) {
        if (event.type == 'keydown') {
            /** @type {KeyboardEvent} */
            const keyboardEvent = event;
            if (keyboardEvent.code === 'Escape') {
                this.switchTo(this.app.menuScene);
                return;
            }
            if (keyboardEvent.key == '?') {
                this.switchTo(this.app.helpScene);
                return;
            }
            const player = this.app.baseSystem.getPlayer();
            const deep = player.get(DeepComponent).deep;
            if (keyboardEvent.key == '>' && keyboardEvent.shiftKey) {
                player.get(DepthMovingComponent)
                    .setup({
                        toDeep: deep + 1,
                    });
                this.app.update();
                return;
            }
            if (keyboardEvent.key == '<' && keyboardEvent.shiftKey) {
                player.get(DepthMovingComponent)
                    .setup({
                        toDeep: deep - 1,
                    });
                this.app.update();
                return;
            }
            const direction = getDirectionByKeyboardEvent(keyboardEvent);
            if (!direction) {
                return;
            }
            const newPosition =
                direction.clone().add(
                    this.app.baseSystem.getPlayer()
                        .get(Position2DComponent)
                );
            const enemy = this.app.baseSystem.getTeamBeing(newPosition);
            if (enemy != null && enemy.get(TeamComponent).teamName === 'goblins') {
                new EntitiesBuilder()
                    .createAutoAttackEntity(
                        player.getId(),
                        enemy.getId(),
                    )
                    .addCreatedEntitiesToEngine(this.app.engine);
                this.app.update();
                return;
            }
            player.get(MoveDirection2DComponent)
                .setup({
                    x: direction.x,
                    y: direction.y,
                });
            this.app.update();
            return;
        }
    }
}
