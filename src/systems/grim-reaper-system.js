import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import BaseSystem from "./base-system";
import HealthPointsComponent from "../components/health-points-component";
import KillComponent from "../components/kill-component";

export default class GrimReaperSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.healthEntities = this.engine.getSmartEntityContainer([
            HealthPointsComponent,
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        for (let entity of this.healthEntities.getEnabledEnties()) {
            if (!this.isAlive(entity)) {
                this.engine.removeEntity(entity.getId());
            }
        }
    }
}
