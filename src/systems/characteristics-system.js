import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import HealthPointsComponent from "../components/health-points-component";
import With from '../tools/with';
import PhysicalDamageComponent from "../components/physical-damage-component";
import ShieldPDmgForKillPassiveSkillComponent from "../components/shield-pdmg-for-kill-passive-skill-component";

export default class CharacteristicsSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.healthComponents = this.engine.getSmartEntityContainer([
            HealthPointsComponent, PhysicalDamageComponent
        ]);
        this.skilledEntities = this.engine.getSmartEntityContainer([
            ShieldPDmgForKillPassiveSkillComponent, PhysicalDamageComponent
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let entity of this.skilledEntities.getEnabledEnties()) {
            const skillComp = entity.get(ShieldPDmgForKillPassiveSkillComponent);
            new With(entity.get(PhysicalDamageComponent))
                .do(x => x.bonusPhysicalDamage += skillComp.pDmg);
        }
        for (let entity of this.healthComponents.getEnabledEnties()) {
            new With(entity.get(HealthPointsComponent))
                .do(x => {
                    x.totalHealthPoints = x.baseHealthPoints + x.bonusHealthPoints;
                });
            new With(entity.get(PhysicalDamageComponent))
                .do(x => {
                    x.totalPhysicalDamage = x.basePhysicalDamage + x.bonusPhysicalDamage;
                    x.currentPhysicalDamage = x.totalPhysicalDamage;
                });
        }
    }
}
