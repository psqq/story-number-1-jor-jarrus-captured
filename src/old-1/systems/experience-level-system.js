import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import KillComponent from "../components/kill-component";
import ExperienceLevelComponent from "../components/experience-level-component";
import config from "../config";
import HealthPointsComponent from "../components/health-points-component";
import Entity from "../core/ecs-engine/entity";
import PhysicalDamageComponent from '../components/physical-damage-component';

export default class ExperienceLevelSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.es = {
            experienced: this.engine.getSmartEntityContainer([
                ExperienceLevelComponent
            ]),
            kills: this.engine.getSmartEntityContainer([
                KillComponent
            ]),
        };
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let killEntity of this.es.kills.getEnabledEnties()) {
            const killComp = killEntity.get(KillComponent);
            const killer = this.es.experienced.getEntityById(killComp.killerId);
            if (!killer) {
                continue;
            }
            const expComp = killer.get(ExperienceLevelComponent);
            if (!expComp) {
                continue;
            }
            if (expComp.level >= config.experience.maxLevel) {
                continue;
            }
            expComp.currentExperience += config.experience.experienceForKilling;
            if (expComp.currentExperience >= expComp.nextLevelExperience) {
                const nextLevelExperience = expComp.nextLevelExperience;
                let dExp = expComp.nextLevelExperience - expComp.currentLevelExperience;
                dExp += config.experience.experienceEnhancer;
                expComp.currentLevelExperience = expComp.nextLevelExperience;
                expComp.nextLevelExperience = expComp.currentLevelExperience + dExp;
                expComp.level += 1;
                this.levelup(killer);
            }
        }
        for (let killEntity of this.es.kills.getEnabledEnties()) {
            this.engine.removeEntity(killEntity.getId());
        }
    }
    /**
     * @param {Entity} entity 
     */
    levelup(entity) {
        const hpComp = entity.get(HealthPointsComponent);
        hpComp.currentHealthPoints += hpComp.healthPointsPerLevel;
        hpComp.baseHealthPoints += hpComp.healthPointsPerLevel;
        const pDmgComp = entity.get(PhysicalDamageComponent);
        pDmgComp.currentPhysicalDamage += pDmgComp.physicalDamagePerLevel;
        pDmgComp.totalPhysicalDamage += pDmgComp.physicalDamagePerLevel;
    }
}