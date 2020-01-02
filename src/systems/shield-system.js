import Victor from 'victor';
import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import BaseSystem from "./base-system";
import KillComponent from '../components/kill-component';
import ShieldComponent from '../components/shield-component';
import DamageComponent from '../components/damage-component';

export default class ShieldSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.shieldedEntities = this.engine.getSmartEntityContainer([
            ShieldComponent,
        ]);
        this.damageEntities = this.engine.getSmartEntityContainer([
            DamageComponent,
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for(let shieldedEntity of this.shieldedEntities.getEnabledEnties()) {
            const shieldComp = shieldedEntity.get(ShieldComponent);
            for(let damageEntity of this.damageEntities.getEnabledEnties()) {
                const dmgComp = damageEntity.get(DamageComponent);
                if (shieldedEntity.getId() == dmgComp.targetId) {
                    let val = Math.min(shieldComp.shield, dmgComp.physicalDamage);
                    shieldComp.shield -= val;
                    dmgComp.physicalDamage -= val;
                    val = Math.min(shieldComp.shield, dmgComp.magicDamage);
                    shieldComp.shield -= val;
                    dmgComp.magicDamage -= val;
                }
            }
        }
    }
}
