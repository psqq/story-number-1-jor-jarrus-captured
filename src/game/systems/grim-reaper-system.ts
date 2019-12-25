import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import BaseSystem from "./base-system";
import HealthPointsComponent from "../components/health-points-component";
import TeamComponent from "../components/team-component";

export default class GrimReaperSystem extends BaseSystem {
    private healthEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.healthEntities = new SmartEntitiesContainer(engine, [
            HealthPointsComponent, TeamComponent,
        ]);
    }
    clear() {
        super.clear();
        this.healthEntities.clear();
    }
    update(deltaTime: number = 0) {
        for (let entity of this.healthEntities.getEnties()) {
            if (entity.get(HealthPointsComponent).currentHealthPoints <= 0) {
                this.engine.removeEntity(entity.getId());
            }
        }
    }
}
