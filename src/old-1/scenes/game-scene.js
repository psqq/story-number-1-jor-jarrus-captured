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
import HeroQSkillComponent from '../components/hero-qskill-component';
import With from '../tools/with';
import AutoAttackComponent from '../components/auto-attack-component';

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
        this.bs = this.app.baseSystem;
    }
    /**
     * Opens the menu scene.
     */
    start() {
        super.start();
        this.bs = this.app.baseSystem;
        this.update(0);
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
        if (!this.bs.getPlayer()) {
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
        this.leftInfoEl = this.informer.getInfoEl(this.bs.getPlayer());
        if (this.infoEntity) {
            if (this.app.engine.isEntity(this.infoEntity.getId())) {
                this.rightInfoEl = this.informer.getInfoEl(this.infoEntity);
            }
        }
        if (!this.rightInfoEl && this.infoPosition) {
            const fov = this.bs.getPlayerFov().fov;
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
            // Change infoPosition if need
            if (this.infoPosition == null
                || !this.infoPosition.isEqualTo(this.mouseMovePosition)
            ) {
                this.infoPosition = this.mouseMovePosition;
                this.draw();
            }
        }
        // Handle keyboard events
        if (event.type == 'keydown') {
            /** @type {KeyboardEvent} */
            const keyboardEvent = event;
            // console.log(event);
            // Back to main menu on Escape
            if (keyboardEvent.code === 'Escape') {
                this.switchTo(this.app.menuScene);
                return;
            }
            // Show help screen on '?'
            if (keyboardEvent.key == '?') {
                this.switchTo(this.app.helpScene);
                return;
            }
            // Now handle events for player
            const player = this.bs.getPlayer();
            if (!player) {
                return;
            }
            const playerDeep = this.bs.getPlayerDeep();
            // Handle depth moving events
            let toDeep = playerDeep;
            if (keyboardEvent.key == '>' && keyboardEvent.shiftKey) {
                toDeep = playerDeep + 1;
            }
            if (keyboardEvent.key == '<' && keyboardEvent.shiftKey) {
                toDeep = playerDeep - 1;
            }
            // Try depth moving
            if (Math.abs(toDeep - playerDeep) == 1) {
                // Set deep for moving
                player.get(DepthMovingComponent)
                    .setup({
                        toDeep,
                    });
                // Starting the system to check for possibility movement
                this.app.engine.updateSystemGroups(
                    [
                        config.systemGroups.depthMove,
                    ],
                    [],
                    0
                );
                // If movement is not possible, the component will be de-initialized.
                if (player.get(DepthMovingComponent).isInitialized()) {
                    this.update(1);
                }
                return;
            }
            // Use Q skill
            if (keyboardEvent.key == 'q') {
                new With(player.get(HeroQSkillComponent))
                    .do(x => {
                        if (x.coolDown > 0) {
                            alert('Skill still on cooldown!');
                            return;
                        }
                        x.duration = config.skills.heroQSkill.duration[x.level];
                        x.damage = config.skills.heroQSkill.damage[x.level];
                        x.damageReduction = config.skills.heroQSkill.damageReduction[x.level];
                    });
                return;
            }
            // Try attack or flat moving
            const direction = getDirectionByKeyboardEvent(keyboardEvent);
            if (!direction) {
                return;
            }
            const newPosition = this.bs.getPlayerPosition().add(direction);
            const enemy = this.bs.getEnemy(newPosition);
            // Try attacking
            if (enemy) {
                // If player under Q skill duration, then he can not attacking
                let flag = true;
                new With(player.get(HeroQSkillComponent))
                    .do(x => {
                        if (x.duration > 0) {
                            alert("You cannot act while Q skill is in effect.");
                            flag = false;
                        }
                    });
                // Do attack if can
                if (flag) {
                    new With(player.get(AutoAttackComponent))
                        .do(x => x.targetId = enemy.getId());
                    this.update(1);
                }
                return;
            }
            // Try flat moving
            if (direction.isZero()) {
                // If move diretion is zero, then just skip turn
                this.update(1);
            } else {
                // Set direction for moving
                new With(player.get(MoveDirection2DComponent))
                    .do(dir => {
                        dir.x = direction.x;
                        dir.y = direction.y;
                    });
                // Starting the system to check for possibility movement
                this.app.engine.updateSystemGroups(
                    [
                        config.systemGroups.flatMove,
                    ],
                    [],
                    0
                );
                // If movement is not possible, the component will be de-initialized.
                if (player.get(MoveDirection2DComponent).isInitialized()) {
                    this.update(1);
                }
            }
            return;
        }
    }
}
