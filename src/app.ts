import config from './config';
import Engine from './core/engine';
import EntitiesBuilder from './game/entities-builder';
import EngineBuilder from './core/engine-builder';
import DungeonDisplaySystem from './game/systems/dungeon-display-system';
import DisplaySystem from './game/systems/display-system';
import '../assets/style.css';
import BaseSystem from './game/systems/base-system';
import { Display } from 'rot-js';

export default class App {

    display: Display = null;
    appElement: HTMLDivElement = null;
    engine: Engine;
    baseSystem: BaseSystem;
    
    constructor() { }
    /**
     *  Downloading assets.
     */
    async load() { }
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
     * Configures the application
     */
    init() {
        this.initAppElement();
        // Create the display
        this.display = new Display(config.rotjsDisplayOptions);
        this.appElement.appendChild(this.display.getContainer());
        // Initialize engine
        this.initEngine();
    }
    initEngine() {
        this.engine = new Engine();
        this.baseSystem = new BaseSystem(this.engine);
        this.engine = new EngineBuilder(this.engine)
            .addSystem(new DungeonDisplaySystem(this.engine, this.display))
                .withGroup('display')
            .addSystem(new DisplaySystem(this.engine, this.display))
                .withGroup('display')
            .getEngine()
        ;
        new EntitiesBuilder()
            .createDungeon()
            .addCreatedEntitiesToEngine(this.engine)
        ;
        const freePositions = this.baseSystem.getFreePositions();
        const position = freePositions[Math.floor(Math.random() * freePositions.length)];
        console.log(freePositions);
        new EntitiesBuilder()
            .createPlayer(position)
            .addCreatedEntitiesToEngine(this.engine)
        ;
    }
    /**
     * Launches the application.
     */
    run() {
        this.engine.update();
    }
}
