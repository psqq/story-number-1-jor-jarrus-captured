import Victor from 'victor';
import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import BaseSystem from "./base-system";
import DamageComponent from '../components/damage-component';
import HealthPointsComponent from '../components/health-points-component';
import KillComponent from '../components/kill-component';
import With from '../tools/with';

export default class DamageSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.damageEntities = this.engine.getSmartEntityContainer([
            DamageComponent,
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let dmgEntity of this.damageEntities.getEnabledEnties()) {
            const dmgComp = dmgEntity.get(DamageComponent);
            const targetHpComp =
                this.engine.getEntityById(dmgComp.targetId)
                    .get(HealthPointsComponent);
            targetHpComp.currentHealthPoints -=
                dmgComp.physicalDamage
                + dmgComp.magicDamage;
            if (targetHpComp.currentHealthPoints <= 0) {
                this.engine.createEntity([
                    new With(new KillComponent())
                        .do(x => {
                            x.killerId = dmgComp.sourceId;
                            x.killedId = dmgComp.targetId;
                        })
                        .finish()
                ]);
            }
        }
        for (let dmgEntity of this.damageEntities.getEnabledEnties()) {
            this.engine.removeEntity(dmgEntity.getId());
        }
    }
}
