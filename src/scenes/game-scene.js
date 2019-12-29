import Scene from './scene';
import App from '../app';
import getDirectionByKeyboardEvent from '../tools/get-direction-by-keyboard-event';
import EntitiesBuilder from '../entities-builder';
import Position2DComponent from '../components/position-2d-component';
import TeamComponent from '../components/team-component';
import DepthMovingComponent from '../components/depth-moving-component';
import DeepComponent from '../components/deep-compnent';
import MoveDirection2DComponent from '../components/move-direction-2d-component';
import Informer from '../informer';
import Victor from "victor";
import config from '../config';

/**
 * Represents the scene that displays the menu.
 */
export default class GameScene extends Scene {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
        this.informer = new Informer(this.app);
        /** @type {Victor} */
        this.infoPosition = null;
        this.el = document.querySelector(config.screens.game.elementSelector);
    }
    /**
     * Opens the menu scene.
     */
    start() {
        super.start();
        this.update();
    }
    /**
     * Draw screen.
     */
    draw() {
        if (!this.app.baseSystem.getPlayer()) {
            return;
        }
        this.app.leftBar.innerHTML = this.informer.getInfo(this.app.baseSystem.getPlayer());
        if (this.infoPosition) {
            const fov = this.app.baseSystem.getPlayerFov().fov;
            if (fov[this.infoPosition.x] && fov[this.infoPosition.x][this.infoPosition.y]) {
                this.app.rightBar.innerHTML = this.informer.getInfoAboutPosition(this.infoPosition);
            }
        }
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        this.app.update(deltaTime);
        this.draw();
    }
    /**
     * @param {Event} event
     */
    handleEvent(event) {
        super.handleEvent(event);
        if (event.type == 'mousemove') {
            if (this.infoPosition == null
                || !this.infoPosition.isEqualTo(this.mouseMovePosition)
            ) {
                this.infoPosition = this.mouseMovePosition;
                this.draw();
            }
        }
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
            if (!player) {
                return;
            }
            const deep = player.get(DeepComponent).deep;
            if (keyboardEvent.key == '>' && keyboardEvent.shiftKey) {
                player.get(DepthMovingComponent)
                    .setup({
                        toDeep: deep + 1,
                    });
                this.update();
                return;
            }
            if (keyboardEvent.key == '<' && keyboardEvent.shiftKey) {
                player.get(DepthMovingComponent)
                    .setup({
                        toDeep: deep - 1,
                    });
                this.update();
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
                this.update();
                return;
            }
            player.get(MoveDirection2DComponent)
                .setup({
                    x: direction.x,
                    y: direction.y,
                });
            this.update();
            return;
        }
    }
}
