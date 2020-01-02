import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import HealthPointsComponent from "../components/health-points-component";
import With from '../tools/with';
import PhysicalDamageComponent from "../components/physical-damage-component";

export default class InitCharacteristicsSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.healthEntity = this.engine.getSmartEntityContainer([
            HealthPointsComponent, PhysicalDamageComponent
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let entity of this.healthEntity.getEnabledEnties()) {
            new With(entity.get(HealthPointsComponent))
                .do(x => {
                    x.bonusHealthPoints = 0;
                });
            new With(entity.get(PhysicalDamageComponent))
                .do(x => {
                    x.bonusPhysicalDamage = 0;
                });
        }
    }
}
