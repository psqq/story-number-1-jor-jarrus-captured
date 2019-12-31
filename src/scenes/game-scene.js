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
import { el, list, mount, text, unmount } from "redom";
import Entity from '../core/ecs-engine/entity';

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
        /** @type {Entity} */
        this.infoEntity = null;
        this.el = document.querySelector(config.screens.game.elementSelector);
        this.leftInfoEl = null;
        this.rightInfoEl = null;
    }
    /**
     * Opens the menu scene.
     */
    start() {
        super.start();
        this.update();
    }
    finish() {
        super.finish();
        this.app.leftBar.innerHTML = '';
        this.app.rightBar.innerHTML = '';
    }
    /**
     * Draw screen.
     */
    draw() {
        if (!this.app.baseSystem.getPlayer()) {
            return;
        }
        if (this.app.currentScene != this) {
            return;
        }
        if (this.leftInfoEl) {
            unmount(this.app.leftBar, this.leftInfoEl);
            this.leftInfoEl = null;
        }
        if (this.rightInfoEl) {
            unmount(this.app.rightBar, this.rightInfoEl);
            this.rightInfoEl = null;
        }
        this.leftInfoEl = this.informer.getInfoEl(this.app.baseSystem.getPlayer());
        if (this.infoEntity) {
            if (this.app.engine.isEntity(this.infoEntity.getId())) {
                this.rightInfoEl = this.informer.getInfoEl(this.infoEntity);
            }
        }
        if (!this.rightInfoEl && this.infoPosition) {
            const fov = this.app.baseSystem.getPlayerFov().fov;
            if (fov[this.infoPosition.x] && fov[this.infoPosition.x][this.infoPosition.y]) {
                this.rightInfoEl = this.informer.getInfoElAboutPosition(this.infoPosition);
            }
        }
        mount(this.app.leftBar, this.leftInfoEl);
        if (this.rightInfoEl) {
            mount(this.app.rightBar, this.rightInfoEl);
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
            // console.log(event);
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
                if (player.get(DepthMovingComponent).isInitialized()) {
                    this.update(1);
                }
                return;
            }
            if (keyboardEvent.key == '<' && keyboardEvent.shiftKey) {
                player.get(DepthMovingComponent)
                    .setup({
                        toDeep: deep - 1,
                    });
                this.update();
                if (player.get(DepthMovingComponent).isInitialized()) {
                    this.update(1);
                }
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
                this.update(1);
                return;
            }
            if (direction.isZero()) {
                this.update(1);
            } else {
                player.get(MoveDirection2DComponent)
                    .setup({
                        x: direction.x,
                        y: direction.y,
                    });
                this.update();
                if (player.get(MoveDirection2DComponent).isInitialized()) {
                    this.update(1);
                }
            }
            return;
        }
    }
}
