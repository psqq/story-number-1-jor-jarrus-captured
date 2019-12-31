import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import AutoAttackComponent from "../components/auto-attack-component";
import PhysicalDamageComponent from "../components/physical-damage-component";
import HealthPointsComponent from "../components/health-points-component";
import DamageComponent from "../components/damage-component";
import With from '../tools/with';

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
            this.engine.createEntity([
                new With(new DamageComponent())
                    .do(x => {
                        x.sourceId = aaComp.attackingId;
                        x.targetId = aaComp.protectingId;
                        x.physicalDamage = dmg;
                        x.trueDamage = 0;
                        x.magicDamage = 0;
                    })
                    .finish()
            ]);
        }
        for (let aaEntity of this.es.aa.getEnties()) {
            this.engine.removeEntity(aaEntity.getId());
        }
    }
}
