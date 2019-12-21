import * as rot from 'rot-js';
import config from './config';
import Engine from './core/engine';
import EntitiesBuilder from './games/entities-builder';
import EngineBuilder from './core/engine-builder';
import DungeonDisplaySystem from './games/systems/dungen-display-system';
import '../assets/style.css';

export default class App {

    display: rot.Display = null;
    appElement: HTMLDivElement = null;
    engine: Engine;
    
    constructor() {
        this.engine = new Engine();
    }
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
        this.display = new rot.Display(config.rotjsDisplayOptions);
        this.appElement.appendChild(this.display.getContainer());
        // Initialize engine
        this.initEngine();
    }
    initEngine() {
        this.engine = new Engine();
        this.engine = new EngineBuilder(this.engine)
            .addSystem(new DungeonDisplaySystem(this.engine, this.display))
            .withGroup('display')
            .getEngine()
        ;
        new EntitiesBuilder()
            .createDungeon()
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
