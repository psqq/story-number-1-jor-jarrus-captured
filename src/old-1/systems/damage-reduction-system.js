import Victor from 'victor';
import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import HeroQSkillComponent from '../components/hero-qskill-component';
import DamageComponent from '../components/damage-component';

export default class MovementSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.skilledEntities = this.engine.getSmartEntityContainer([
            HeroQSkillComponent
        ]);
        this.damageEntities = this.engine.getSmartEntityContainer([
            DamageComponent,
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let skilledEntity of this.skilledEntities.getEnabledEnties()) {
            const skillComp = skilledEntity.get(ShieldPDmgForKillPassiveSkillComponent);
            for (let damageEntity of this.damageEntities.getEnabledEnties()) {
                const dmgComp = damageEntity.get(DamageComponent);
                if (skilledEntity.getId() == dmgComp.targetId) {
                    let val = Math.min(skillComp.shield, dmgComp.physicalDamage);
                    skillComp.shield -= val;
                    dmgComp.physicalDamage -= val;
                    val = Math.min(skillComp.shield, dmgComp.magicDamage);
                    skillComp.shield -= val;
                    dmgComp.magicDamage -= val;
                }
            }
        }
    }
}
