import KillComponent from '../components/kill-component';
import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import ShieldPDmgForKillPassiveSkillComponent from '../components/shield-pdmg-for-kill-passive-skill-component';
import DamageComponent from '../components/damage-component';

export default class ShieldPDmgForKillPassiveSkillSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine, beforDmg = false) {
        super(engine);
        this.skilledEntities = this.engine.getSmartEntityContainer([
            ShieldPDmgForKillPassiveSkillComponent
        ]);
        this.killEntities = this.engine.getSmartEntityContainer([
            KillComponent
        ]);
        this.damageEntities = this.engine.getSmartEntityContainer([
            DamageComponent,
        ]);
        this.beforDmg = beforDmg;
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (this.beforDmg) {
            for (let skilledEntity of this.skilledEntities.getEnties()) {
                const skillComp = skilledEntity.get(ShieldPDmgForKillPassiveSkillComponent);
                for(let damageEntity of this.damageEntities.getEnties()) {
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
        } else {
            for (let skilledEntity of this.skilledEntities.getEnties()) {
                const skillComp = skilledEntity.get(ShieldPDmgForKillPassiveSkillComponent);
                for (let killEntity of this.killEntities.getEnties()) {
                    if (killEntity.get(KillComponent).killerId == skilledEntity.getId()) {
                        skillComp.pDmg += skillComp.pDmgForKill;
                        skillComp.shield += skillComp.shieldForKill;
                    }
                }
            }
        }
    }
}