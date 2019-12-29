import App from "./app";
import Entity from "./core/ecs-engine/entity";
import HealthPointsComponent from "./components/health-points-component";
import ExperienceLevelComponent from "./components/experience-level-component";
import Victor from "victor";

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
    getInfoAboutPosition(position) {
        let result = '';
        const entities = this.app.baseSystem.getEntitiesInPosition(position);
        for (let entity of entities) {
            result += this.getInfo(entity) + '\n';
        }
        // Return result
        result = `<pre>${result}</pre>`;
        return result;
    }
    /**
     * @param {Entity} entity 
     */
    getInfo(entity) {
        let result = '';
        // ExperienceLevelComponent
        const xpComp = entity.get(ExperienceLevelComponent);
        if (xpComp) {
            result += `Level: ${xpComp.level}\n`;
            const xp = xpComp.currentExperience;
            const nextXp = xpComp.nextLevelExperience;
        }
        // HealthPointsComponent
        const hpComp = entity.get(HealthPointsComponent);
        if (hpComp) {
            result += this.normalizeString(`
            HP: ${hpComp.currentHealthPoints} / ${hpComp.totalHealthPoints} (
                ${hpComp.baseHealthPoints} + ${hpComp.bonusHealthPoints}
            )
            `) + '\n';
        }
        // Return result
        result = `<pre>${result}</pre>`;
        return result;
    }
}
