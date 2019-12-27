import { Display } from "rot-js";
import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import config from "../config";
import Position2DComponent from "../components/position-2d-component";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import PlayerComponent from "../components/player-component";
import ExperienceLevelComponent from "../components/experience-level-component";
import HealthPointsComponent from "../components/health-points-component";
import PhysicalDamageComponent from "../components/physical-damage-component";
import DeepComponent from "../components/deep-compnent";

export default class GameSceneUiSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     * @param {Display} display 
     */
    constructor(engine, display) {
        super(engine);
        this.display = display;
        this.playerEntities = new SmartEntitiesContainer(engine, [
            PlayerComponent, 
            Position2DComponent, DeepComponent,
            ExperienceLevelComponent,
            HealthPointsComponent, PhysicalDamageComponent
        ]);
    }
    clear() {
        super.clear();
        this.playerEntities.clear();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        let topBarInfo = '';
        let bottomBarInfo = '';
        // ------------------------------------------------------------
        // Collecting info
        // ------------------------------------------------------------
        const player = this.playerEntities.getEnties()[0];
        // Position2DComponent
        const deep = player.get(DeepComponent).deep;
        // ExperienceLevelComponent
        const expLvl = player.get(ExperienceLevelComponent);
        const expProgress =
            Math.floor(
                (expLvl.currentExperience - expLvl.currentLevelExperience)
                / (expLvl.nextLevelExperience - expLvl.currentLevelExperience)
                * 100
            );
        // HealthPointsComponent
        const hpComp = player.get(HealthPointsComponent);
        const hp = hpComp.currentHealthPoints;
        const maxHp = hpComp.maxHealthPoints;
        // PhysicalDamageComponent
        const pDmgComp = player.get(PhysicalDamageComponent);
        const pDmg = pDmgComp.currentPhysicalDamage;
        // ------------------------------------------------------------
        // Making top, bottom bars
        // ------------------------------------------------------------
        // Init top bar
        topBarInfo += `Deep: ${deep}`;
        // ------------------------------------------------------------
        // Init bottom bar
        bottomBarInfo += `Lvl: ${expLvl.level}, Exp: ${expProgress}%`;
        bottomBarInfo += `, HP: ${hp} / ${maxHp}`;
        bottomBarInfo += `, PDmg: ${pDmg}`;
        // ------------------------------------------------------------
        // Display bars
        // ------------------------------------------------------------
        this.display.drawText(
            config.gameSceneBars.top.x,
            config.gameSceneBars.top.y,
            topBarInfo
        );
        this.display.drawText(
            config.gameSceneBars.bottom.x,
            config.gameSceneBars.bottom.y,
            bottomBarInfo
        );
    }
}
