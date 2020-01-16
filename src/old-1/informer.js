import App from "./app";
import Entity from "./core/ecs-engine/entity";
import HealthPointsComponent from "./components/health-points-component";
import ExperienceLevelComponent from "./components/experience-level-component";
import Victor from "victor";
import { el, list, mount, text, unmount } from "redom";
import messages from "./messages";
import TypeComponent from "./components/type-component";
import config from "./config";
import PhysicalDamageComponent from "./components/physical-damage-component";
import ShieldPDmgForKillPassiveSkillComponent from "./components/shield-pdmg-for-kill-passive-skill-component";
import DeepComponent from './components/deep-compnent';

export default class Informer {
    /**
     * 
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        this.engine = this.app.engine;
    }
    /**
     * @param {string} s 
     */
    normalizeString(s) {
        return s.replace(/\s+/g, ' ').trim();
    }
    /**
     * @param {Victor} position 
     */
    getInfoElAboutPosition(position) {
        const _ = messages.gettext.bind(messages);
        let childs = [];
        const entities = this.app.baseSystem.getEntitiesInPosition(position);
        for (let entity of entities) {
            childs.push(this.getInfoEl(entity));
        }
        // Return result
        return el('div', childs);
    }
    /**
     * @param {Entity} entity 
     */
    getInfoEl(entity) {
        const _ = messages.gettext.bind(messages);
        let childs = [];
        // TypeComponent
        const typeComp = entity.get(TypeComponent);
        if (typeComp) {
            if (typeComp.typeName == config.beingTypes.goblinMinion) {
                childs = childs.concat(
                    [
                        el('u', [
                            text(`${_("Goblin minion")}:`)
                        ]),
                        el('br'),
                    ]
                );
            }
            if (typeComp.typeName == config.beingTypes.player) {
                childs = childs.concat(
                    [
                        el('u', [
                            text(`${_("Player")}:`)
                        ]),
                        el('br'),
                    ]
                );
            }
            if (typeComp.typeName == config.beingTypes.stairs) {
                childs = childs.concat(
                    [
                        el('u', [
                            text(`${_("Stairs")}:`)
                        ]),
                        el('br'),
                    ]
                );
            }
        }
        // ExperienceLevelComponent
        const deepComp = entity.get(DeepComponent);
        if (deepComp) {
            childs = childs.concat(
                [
                    el('span.indent', [
                        text(`${_("Deep")}: ${deepComp.deep}`)
                    ]),
                    el('br'),
                ]
            );
        }
        // ExperienceLevelComponent
        const xpComp = entity.get(ExperienceLevelComponent);
        if (xpComp) {
            const xp = xpComp.currentExperience;
            const nextXp = xpComp.nextLevelExperience;
            const expProgress =
                Math.floor(
                    (xp - xpComp.currentLevelExperience)
                    / (nextXp - xpComp.currentLevelExperience)
                    * 100
                );
            childs = childs.concat(
                [
                    el('span.indent', [
                        text(`${_("Level")}: ${xpComp.level}`)
                    ]),
                    el('br'),
                    el('span.indent', [
                        text(`${_("Experience")}: ${xp} / ${nextXp} [${expProgress} %]`)
                    ]),
                    el('br'),
                ]
            );
        }
        // HealthPointsComponent
        const hpComp = entity.get(HealthPointsComponent);
        if (hpComp) {
            const hp = hpComp.currentHealthPoints;
            const baseHp = hpComp.baseHealthPoints;
            const bonusHp = hpComp.bonusHealthPoints;
            const maxHp = hpComp.totalHealthPoints;
            const hpPercent = Math.floor(hp / maxHp * 100);
            childs = childs.concat(
                [
                    el('span.indent', [
                        text(`${_("Health")}: ${hp} / ${maxHp} (${baseHp} + ${bonusHp}) [${hpPercent} %]`)
                    ]),
                    el('br'),
                ]
            );
        }
        // PhysicalDamageComponent
        const pDmgComp = entity.get(PhysicalDamageComponent);
        if (hpComp) {
            const pDmg = pDmgComp.currentPhysicalDamage;
            const basePDmg = pDmgComp.basePhysicalDamage;
            const bonusPDmg = pDmgComp.bonusPhysicalDamage;
            childs = childs.concat(
                [
                    el('span.indent', [
                        text(`${_("Physical damage")}: ${pDmg} (${basePDmg} + ${bonusPDmg})`)
                    ]),
                    el('br'),
                ]
            );
        }
        // ShieldPDmgForKillPassiveSkillComponent
        const skillComp = entity.get(ShieldPDmgForKillPassiveSkillComponent);
        if (skillComp) {
            childs = childs.concat(
                [
                    el('span.indent', [
                        text(`${_("Passive skill")}:`)
                    ]),
                    el('br'),
                    el('span.indent2', [
                        text(`${_("Shield")}: ${skillComp.shield}`)
                    ]),
                    el('br'),
                    el('span.indent2', [
                        text(`${_("Bonus pDmg")}: ${skillComp.pDmg}`)
                    ]),
                    el('br'),
                    el('span.indent2', [
                        text(`${_("Duration")}: ${skillComp.duration}`)
                    ]),
                    el('br'),
                ]
            );
        }
        // Return result
        return el('div', childs);
    }
}
