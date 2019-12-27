import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import BaseSystem from "./base-system";
import AutoAttackComponent from "../components/auto-attack-component";
import PhysicalDamageComponent from "../components/physical-damage-component";
import HealthPointsComponent from "../components/health-points-component";

export default class AutoAttackSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.attackableEntities = new SmartEntitiesContainer(engine, [
            PhysicalDamageComponent,
        ]);
        this.protectableEntities = new SmartEntitiesContainer(engine, [
            HealthPointsComponent,
        ]);
        this.autoAttacksEntities = new SmartEntitiesContainer(engine, [
            AutoAttackComponent
        ]);
    }
    erase() {
        super.erase();
        this.attackableEntities.erase();
        this.protectableEntities.erase();
        this.autoAttacksEntities.erase();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let aaEntity of this.autoAttacksEntities.getEnties()) {
            const aaComp = aaEntity.get(AutoAttackComponent);
            const attacker = this.attackableEntities.getEntityById(aaComp.attackingId);
            const protecter = this.protectableEntities.getEntityById(aaComp.protectingId);
            if (!attacker || !protecter) {
                this.engine.removeEntity(aaEntity.getId());
                continue;
            }
            protecter.get(HealthPointsComponent).currentHealthPoints -=
                attacker.get(PhysicalDamageComponent).currentPhysicalDamage;
            this.engine.removeEntity(aaEntity.getId());
        }
    }
}
