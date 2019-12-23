import { Display } from "rot-js";
import Engine from "../../core/engine";
import BaseSystem from "./base-system";
import config from "../../config";
import PositionComponent from "../components/position-component";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import PlayerComponent from "../components/player-component";
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";
import FovComponent from "../components/fov-component";
import ExperienceLevelComponent from "../components/experience-level-component";

export default class GameSceneUiSystem extends BaseSystem {
    private display: Display;
    private playerEntities: SmartEntitiesContainer;
    constructor(engine: Engine, display: Display) {
        super(engine);
        this.display = display;
        this.playerEntities = new SmartEntitiesContainer(engine, [
            PlayerComponent, PositionComponent, ExperienceLevelComponent
        ]);
    }
    update(deltaTime: number = 0) {
        let topBarInfo = '';
        let bottomBarInfo = '';
        // Collecting info
        const player = this.playerEntities.getEnties()[0];
        const deep = player.get(PositionComponent).deep;
        const expLvl = player.get(ExperienceLevelComponent);
        const expProgress =
            Math.floor(
                (expLvl.currentExperience - expLvl.currentLevelExperience)
                / (expLvl.nextLevelExperience - expLvl.currentLevelExperience)
                * 100
            );
        // Init top bar
        topBarInfo += `Deep: ${deep}`;
        // Init bottom bar
        bottomBarInfo += `Lvl: ${expLvl.level} Exp: ${expProgress}%`;
        // Display bars
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
