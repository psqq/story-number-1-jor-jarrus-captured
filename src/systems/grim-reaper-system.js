import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import BaseSystem from "./base-system";
import HealthPointsComponent from "../components/health-points-component";
import TeamComponent from "../components/team-component";

export default class GrimReaperSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.healthEntities = new SmartEntitiesContainer(engine, [
            HealthPointsComponent, TeamComponent,
        ]);
    }
    erase() {
        super.erase();
        this.healthEntities.erase();
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
    }
}
