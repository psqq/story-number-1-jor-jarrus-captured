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
        this.killEntities = this.engine.getSmartEntityContainer([
            KillComponent
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        for (let entity of this.healthEntities.getEnties()) {
            if (entity.get(HealthPointsComponent).currentHealthPoints <= 0) {
                this.engine.removeEntity(entity.getId());
            }
        }
        for (let entity of this.killEntities.getEnties()) {
            this.engine.removeEntity(entity.getId());
        }
    }
}
