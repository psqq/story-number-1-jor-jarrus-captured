import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import HealthPointsComponent from "../components/health-points-component";

export default class CharacteristicsSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.es = {
            withHealth: this.engine.getSmartEntityContainer([
                HealthPointsComponent
            ]),
        };
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let entity of this.es.withHealth.getEnties()) {
            const hpComp = entity.get(HealthPointsComponent);
            hpComp.totalHealthPoints = hpComp.baseHealthPoints + hpComp.bonusHealthPoints;
        }
    }
}
