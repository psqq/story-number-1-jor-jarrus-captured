import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import AutoAttackComponent from "../components/auto-attack-component";
import PhysicalDamageComponent from "../components/physical-damage-component";
import HealthPointsComponent from "../components/health-points-component";
import EntitiesBuilder from "../entities-builder";

export default class AutoAttackSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.es = {
            attackable: this.engine.getSmartEntityContainer([
                PhysicalDamageComponent
            ]),
            protectable: this.engine.getSmartEntityContainer([
                HealthPointsComponent
            ]),
            aa: this.engine.getSmartEntityContainer([
                AutoAttackComponent
            ]),
        };
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (deltaTime <= 0) {
            return;
        }
        for (let aaEntity of this.es.aa.getEnties()) {
            const aaComp = aaEntity.get(AutoAttackComponent);
            const attacker = this.es.attackable.getEntityById(aaComp.attackingId);
            const protecter = this.es.protectable.getEntityById(aaComp.protectingId);
            if (!attacker || !protecter) {
                continue;
            }
            const dmg = attacker.get(PhysicalDamageComponent).currentPhysicalDamage;
            protecter.get(HealthPointsComponent).currentHealthPoints -= dmg;
            if (protecter.get(HealthPointsComponent).currentHealthPoints <= 0) {
                new EntitiesBuilder()
                    .createKillEntity(aaComp.attackingId, aaComp.protectingId)
                    .addCreatedEntitiesToEngine(this.engine);
            }
        }
        for (let aaEntity of this.es.aa.getEnties()) {
            this.engine.removeEntity(aaEntity.getId());
        }
    }
}
