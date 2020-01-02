import { Display } from "rot-js";
import Victor from "victor";
import moment from "moment";
import config from "./config";
import Engine from './core/ecs-engine/engine';
import MenuScene from "./scenes/menu-scene";
import EntitiesBuilder from "./entities-builder";
import BaseSystem from "./systems/base-system";
import IdComponent from "./components/id-component";
import DeepComponent from "./components/deep-compnent";
import DungeonComponent from "./components/dungeon-component";
import ExperienceLevelComponent from "./components/experience-level-component";
import FovComponent from "./components/fov-component";
import GlyphComponent from "./components/glyph-component";
import HealthPointsComponent from "./components/health-points-component";
import MemorizedFovAreaComponent from "./components/memorized-fov-area-component";
import MoveDirection2DComponent from "./components/move-direction-2d-component";
import ObstacleComponent from "./components/obstacle-component";
import PhysicalDamageComponent from "./components/physical-damage-component";
import PlayerComponent from "./components/player-component";
import Position2DComponent from "./components/position-2d-component";
import StairsComponent from "./components/stairs-component";
import TeamComponent from "./components/team-component";
import AutoAttackComponent from "./components/auto-attack-component";
import messages from "./messages";
import HelpScene from "./scenes/help-scene";
import DepthMovingComponent from "./components/depth-moving-component";
import DisplaySystem from "./systems/display-system";
import GameScene from "./scenes/game-scene";
import FovSystem from "./systems/fov-system";
import DungeonDisplaySystem from "./systems/dungeon-display-system";
import MovementSystem from "./systems/movement-system";
import DepthMovingSystem from "./systems/depth-moving-system";
import MemorizedFovAreasSystem from "./systems/memorized-fov-areas-system";
import AutoAttackSystem from "./systems/auto-attack-system";
import GrimReaperSystem from "./systems/grim-reaper-system";
import SimpleAiSystem from "./systems/simple-ai-system";
import SimpleAiComponent from "./components/simple-ai-component";
import Scene from "./scenes/scene";
import LoseScene from "./scenes/lose-scene";
import KillComponent from "./components/kill-component";
import ExperienceLevelSystem from "./systems/experience-level-system";
import CharacteristicsSystem from "./systems/characteristics-system";
import TypeComponent from "./components/type-component";
import DamageComponent from "./components/damage-component";
import ShieldComponent from "./components/shield-component";
import ShieldPDmgForKillPassiveSkillComponent from "./components/shield-pdmg-for-kill-passive-skill-component";
import DamageSystem from "./systems/damage-system";
import ShieldSystem from "./systems/shield-system";
import ShieldPDmgForKillPassiveSkillSystem from "./systems/shield-pdmg-for-kill-passive-skill-system";
import InitCharacteristicsSystem from './systems/init-characteristics-system';
import HeroQSkillComponent from './components/hero-qskill-component';
import Updater from './classes/updater';
import With from './tools/with';

export default class App {
    constructor() {
        // display
        this.display = new Display(config.rotjsDisplayOptions);

        // Left/right bars
        /** @type {HTMLDivElement} */
        this.leftBar = document.querySelector('.left-bar');
        /** @type {HTMLDivElement} */
        this.rightBar = document.querySelector('.right-bar');

        // engine
        this.engine = new Engine();
        this.baseSystem = null;
        this.updater = new Updater(this.engine);

        // scenes
        this.menuScene = new MenuScene(this);
        this.helpScene = new HelpScene(this);
        this.gameScene = new GameScene(this);
        this.loseScene = new LoseScene(this);
        /** @type {Scene} */
        this.currentScene = null;
        // others
        this.userName = config.defaultUserName;
    }
    async load() { }
    /**
     * @param {string} locale 
     */
    setLocale(locale) {
        if (!locale) {
            return;
        }
        localStorage.setItem('locale', locale);
        messages.setLocale(locale);
    }
    restoreLocale() {
        const locale = localStorage.getItem('locale');
        if (!locale) {
            return;
        }
        messages.setLocale(locale);
    }
    createEntities() {
        // Create entities
        const entitiesBuider = new EntitiesBuilder();
        entitiesBuider
            .createPlayer(new Victor(0, 0), 1)
            .createDungeon(1)
            .addCreatedEntitiesToEngine(this.engine)
            ;
        const position = this.baseSystem.getRandomMovablePosition();
        new With(
            this.baseSystem.getPlayer()
                .get(Position2DComponent)
        )
            .do(pos => {
                pos.x = position.x;
                pos.y = position.y;
            });
    }
    initSystems() {
        // System with base functions
        this.baseSystem = new BaseSystem(this.engine);
        this.engine.addSystem(
            this.baseSystem,
            [
                config.systemGroups.base,
            ]
        );
        // this.engine.addSystem(new InitCharacteristicsSystem(this.engine));
        // Ai
        // this.engine.addSystem(new SimpleAiSystem(this.engine));
        // Action systems
        this.engine.addSystem(
            new DepthMovingSystem(this.engine),
            [
                config.systemGroups.move,
                config.systemGroups.depthMove,
            ]
        );
        this.engine.addSystem(
            new MovementSystem(this.engine),
            [
                config.systemGroups.move,
                config.systemGroups.flatMove,
            ]
        );
        this.engine.addSystem(
            new AutoAttackSystem(this.engine),
            [
                config.systemGroups.attack,
            ]
        );
        // Appling systems
        // this.engine.addSystem(new CharacteristicsSystem(this.engine));
        // this.engine.addSystem(new ShieldSystem(this.engine));
        // this.engine.addSystem(new ShieldPDmgForKillPassiveSkillSystem(this.engine, true));
        // this.engine.addSystem(new DamageSystem(this.engine));
        // this.engine.addSystem(new ShieldPDmgForKillPassiveSkillSystem(this.engine, false));
        // this.engine.addSystem(new InitCharacteristicsSystem(this.engine));
        // this.engine.addSystem(new CharacteristicsSystem(this.engine));
        // this.engine.addSystem(new ExperienceLevelSystem(this.engine));
        // Clear systems
        this.engine.addSystem(
            new GrimReaperSystem(this.engine),
            [
                config.systemGroups.clear,
                config.systemGroups.grimReaper,
            ]
        );
        // Display systems
        this.engine.addSystem(
            new FovSystem(this.engine),
            [
                config.systemGroups.fov,
                config.systemGroups.display,
            ]
        );
        this.engine.addSystem(
            new MemorizedFovAreasSystem(this.engine),
            [
                config.systemGroups.fov,
                config.systemGroups.display,
            ]
        );
        this.engine.addSystem(
            new DungeonDisplaySystem(this.engine, this.display),
            [
                config.systemGroups.display,
            ]
        );
        this.engine.addSystem(
            new DisplaySystem(this.engine, this.display),
            [
                config.systemGroups.display,
            ]
        );
    }
    initEngine() {
        this.engine.registerComponentClasses([
            AutoAttackComponent,
            DeepComponent,
            DungeonComponent,
            ExperienceLevelComponent,
            FovComponent,
            GlyphComponent,
            HealthPointsComponent,
            IdComponent,
            MemorizedFovAreaComponent,
            MoveDirection2DComponent,
            ObstacleComponent,
            PhysicalDamageComponent,
            PlayerComponent,
            Position2DComponent,
            StairsComponent,
            TeamComponent,
            DepthMovingComponent,
            SimpleAiComponent,
            KillComponent,
            TypeComponent,
            DamageComponent,
            ShieldComponent,
            ShieldPDmgForKillPassiveSkillComponent,
            HeroQSkillComponent,
        ])
        this.initSystems();
        this.updater = new Updater(this.engine);
    }
    initDisplay() {
        this.gameScene.el.appendChild(this.display.getContainer());
    }
    init() {
        this.restoreLocale();
        this.initDisplay();
        this.initEngine();
        this.createEntities();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        this.display.clear();
        this.updater.update(deltaTime);
        this.engine.updateSystemGroups(["display"], [], 0);
        if (!this.baseSystem.getPlayer() || !this.baseSystem.isAlive(this.baseSystem.getPlayer())) {
            this.startNewGame();
            this.currentScene.switchTo(this.loseScene);
            return;
        }
    }
    startNewGame() {
        this.engine.erase();
        this.initEngine();
        this.createEntities();
    }
    /**
     * Configure size of left/right bars.
     */
    adjustElementSizes() {
        const displayCanvas = document.querySelector('canvas');
        const paddingsOfBars = 10;
        const widthOfBars =
            (window.innerWidth - displayCanvas.width - 4 * paddingsOfBars) / 2;
        const heightOfBars = window.innerHeight - 2 * paddingsOfBars;
        this.leftBar.style.width = widthOfBars + "px";
        this.leftBar.style.height = heightOfBars + "px";
        this.leftBar.style.left = paddingsOfBars + "px";
        this.leftBar.style.top = paddingsOfBars + "px";
        this.rightBar.style.width = widthOfBars + "px";
        this.rightBar.style.height = heightOfBars + "px";
        this.rightBar.style.right = paddingsOfBars + "px";
        this.rightBar.style.top = paddingsOfBars + "px";
    }
    run() {
        this.menuScene.start();
        this.adjustElementSizes();
        window.addEventListener("resize", (event) => {
            this.adjustElementSizes();
        });
    }
    saveGame() {
        localStorage.setItem('engine', this.engine.toString());
        localStorage.setItem('userName', this.userName);
        localStorage.setItem('date', moment().format("MMM Do YY, HH:mm:ss"));
        localStorage.setItem('deep', '' + this.baseSystem.getPlayerDeep());
    }
    loadGame() {
        this.engine.erase();
        this.initEngine();
        this.engine.fromString(localStorage.getItem('engine'));
        this.userName = localStorage.getItem('userName');
    }
}
