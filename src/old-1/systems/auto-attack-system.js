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
        this.aaCont = this.engine.getSmartEntityContainer([
            AutoAttackComponent
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (deltaTime <= 0) {
            return;
        }
        for (let attackerEnt of this.aaCont.getEnabledEnties()) {
            const aaComp = attackerEnt.get(AutoAttackComponent);
            const protecterEnt = this.engine.getEntityById(aaComp.targetId);
            if (!protecterEnt) {
                continue;
            }
            this.doAa(attackerEnt, protecterEnt);
            aaComp.targetId = null;
        }
    }
}
