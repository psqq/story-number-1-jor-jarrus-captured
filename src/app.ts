import config from './config';
import Engine from './core/engine';
import EntitiesBuilder from './game/entities-builder';
import EngineBuilder from './core/engine-builder';
import DungeonDisplaySystem from './game/systems/dungeon-display-system';
import DisplaySystem from './game/systems/display-system';
import BaseSystem from './game/systems/base-system';
import { Display } from 'rot-js';
import MovementSystem from './game/systems/movement-system';
import FovSystem from './game/systems/fov-system';
import MenuScene from './scenes/menu-scene';
import GameScene from './scenes/game-scene';
import HelpScene from './scenes/help-scene';
import WebFontLoader from 'webfontloader';
import Victor from 'victor';
import PositionComponent from './game/components/position-component';
import GameSceneUiSystem from './game/systems/game-scene-ui-system';
import MemorizedFovAreasSystem from './game/systems/memorized-fov-areas-system';
import DungeonComponent from './game/components/dungeon-component';
import FovComponent from './game/components/fov-component';
import GlyphComponent from './game/components/glyph-component';
import MemorizedFovAreaComponent from './game/components/memorized-fov-area-component';
import MoveDirectionComponent from './game/components/move-direction-component';
import PlayerComponent from './game/components/player-component';
import StairsComponent from './game/components/stairs-component';
import moment from 'moment';
import ExperienceLevelComponent from './game/components/experience-level-component';
import HealthPointsComponent from './game/components/health-points-component';
import PhysicalDamageComponent from './game/components/physical-damage-component';
import ObstacleComponent from './game/components/obstacle-component';

/**
 * Main appliction
 */
export default class App {

    // Display elements
    display: Display = null;
    appElement: HTMLDivElement = null;

    // Engine elements
    engine: Engine;
    baseSystem: BaseSystem;

    // Scenes
    menuScene: MenuScene;
    gameScene: GameScene;
    helpScene: HelpScene;

    // User info
    userName: string = "User Name";

    constructor() { }

    /**
     *  Downloading assets.
     */
    async load() {
        await new Promise((res, rej) => {
            WebFontLoader.load({
                custom: {
                    families: ['Typori'],
                },
                active: () => {
                    res();
                }
            });
        });
    }

    /**
     *  Creating the application element.
     */
    initAppElement() {
        // Create the body with one div element
        let body = document.querySelector('body');
        this.appElement = document.createElement('div');
        body.appendChild(this.appElement);
    }

    /**
     * Initialize game scenes.
     */
    initScenes() {
        this.menuScene = new MenuScene(this);
        this.gameScene = new GameScene(this);
        this.helpScene = new HelpScene(this);
    }

    /**
     * Configures the application.
     */
    init() {
        this.initAppElement();
        // Create the display
        this.display = new Display(config.rotjsDisplayOptions);
        this.appElement.appendChild(this.display.getContainer());
        // Initialize engine
        this.initEngine();
        // Initialize game scenes
        this.initScenes();
    }
    /**
     * Initialize engine: systems and entities.
     */
    initEngine() {
        // Create engine
        this.engine = new Engine();
        this.baseSystem = new BaseSystem(this.engine);
        // Create systems
        this.engine = new EngineBuilder(this.engine)
            .addSystem(new MovementSystem(this.engine))
            .withGroup('actions')
            .addSystem(new FovSystem(this.engine))
            .withGroup('fov')
            .addSystem(new MemorizedFovAreasSystem(this.engine))
            .withGroup('fov')
            .addSystem(new DungeonDisplaySystem(this.engine, this.display))
            .withGroup('display')
            .addSystem(new DisplaySystem(this.engine, this.display))
            .withGroup('display')
            .addSystem(new GameSceneUiSystem(this.engine, this.display))
            .withGroup('display')
            .getEngine()
            ;
        // Create entities
        const entitiesBuider = new EntitiesBuilder();
        entitiesBuider
            .createPlayer(new Victor(0, 0), 1)
            .createDungeon(1)
            .addCreatedEntitiesToEngine(this.engine)
            ;
        const position = this.baseSystem.getRandomMovablePosition();
        this.baseSystem.getPlayer()
            .get(PositionComponent)
            .setX(position.x)
            .setY(position.y)
            ;
    }
    /**
     * Start new game.
     */
    startNewGame() {
        this.initEngine();
        this.update();
    }
    /**
     * Update game
     */
    update() {
        this.display.clear();
        this.engine.update();
    }
    /**
     * Launches the application.
     */
    run() {
        this.update();
        this.menuScene.start();
    }
    saveGame() {
        localStorage.setItem('engine', this.engine.toString());
        localStorage.setItem('userName', this.userName);
        localStorage.setItem('date', moment().format("MMM Do YY, hh:mm:ss"));
        localStorage.setItem('deep', '' + this.baseSystem.getCurrentDeep());
    }
    loadGame() {
        const context: any = {};
        const componentClasses = [
            DungeonComponent,
            FovComponent,
            GlyphComponent,
            MemorizedFovAreaComponent,
            MoveDirectionComponent,
            PlayerComponent,
            PositionComponent,
            StairsComponent,
            ExperienceLevelComponent,
            ObstacleComponent,
            HealthPointsComponent,
            PhysicalDamageComponent,
        ];
        for (let ComponentClass of componentClasses) {
            context[ComponentClass.name] = ComponentClass;
        }
        this.engine.fromString(localStorage.getItem('engine'), context);
        this.userName = localStorage.getItem('userName');
    }
}
