import { Display } from "rot-js";
import Engine from "../../core/engine";
import BaseSystem from "./base-system";
import config from "../../config";
import PositionComponent from "../components/position-component";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import PlayerComponent from "../components/player-component";
import ExperienceLevelComponent from "../components/experience-level-component";
import HealthPointsComponent from "../components/health-points-component";
import PhysicalDamageComponent from "../components/physical-damage-component";

export default class GameSceneUiSystem extends BaseSystem {
    private display: Display;
    private playerEntities: SmartEntitiesContainer;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.display = display;
        this.playerEntities = new SmartEntitiesContainer(engine, [
            PlayerComponent, PositionComponent, ExperienceLevelComponent,
            HealthPointsComponent, PhysicalDamageComponent
        ]);
    }
    clear() {
        super.clear();
        this.playerEntities.clear();
    }
    update(deltaTime: number = 0) {
        let topBarInfo = '';
        let bottomBarInfo = '';
        // ------------------------------------------------------------
        // Collecting info
        // ------------------------------------------------------------
        const player = this.playerEntities.getEnties()[0];
        // PositionComponent
        const deep = player.get(PositionComponent).deep;
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
