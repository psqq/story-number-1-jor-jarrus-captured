import { Display } from "rot-js";
import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import Informer from "../informer";
import App from "../app";

export default class GameSceneUiSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     * @param {App} app 
     */
    constructor(engine, app) {
        super(engine);
        this.app = app;
        this.informer = new Informer(this.app);
    }
    clear() {
        super.clear();
        this.playerEntities.clear();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        if (!this.getPlayer()) {
            return;
        }
    }
}
