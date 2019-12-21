import config from './config';
import Engine from './core/engine';
import EntitiesBuilder from './game/entities-builder';
import EngineBuilder from './core/engine-builder';
import DungeonDisplaySystem from './game/systems/dungeon-display-system';
import DisplaySystem from './game/systems/display-system';
import '../assets/style.css';
import BaseSystem from './game/systems/base-system';
import { Display } from 'rot-js';
import Victor = require('victor');
import PlayerComponent from './game/components/player-component';
import MoveDirectionComponent from './game/components/move-direction-component';
import MovementSystem from './game/systems/movement-system';
import FovSystem from './game/systems/fov-system';

export default class App {

    display: Display = null;
    appElement: HTMLDivElement = null;
    engine: Engine;
    baseSystem: BaseSystem;
    directionByKey: { [key: string]: Victor };

    constructor() {
        this.directionByKey = {
            'KeyH': new Victor(-1, 0),
            'KeyL': new Victor(1, 0),
            'KeyK': new Victor(0, -1),
            'KeyJ': new Victor(0, 1),
            'KeyY': new Victor(-1, -1),
            'KeyU': new Victor(1, -1),
            'KeyB': new Victor(-1, 1),
            'KeyN': new Victor(1, 1),
            'Numpad4': new Victor(-1, 0),
            'Numpad6': new Victor(1, 0),
            'Numpad8': new Victor(0, -1),
            'Numpad2': new Victor(0, 1),
            'Numpad7': new Victor(-1, -1),
            'Numpad9': new Victor(1, -1),
            'Numpad1': new Victor(-1, 1),
            'Numpad3': new Victor(1, 1),
        };
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
        this.display = new Display(config.rotjsDisplayOptions);
        this.appElement.appendChild(this.display.getContainer());
        // Initialize engine
        this.initEngine();
        // Bind events
        this.bindEvents();
    }
    /**
     * Initialize engine: systems and entities.
     */
    initEngine() {
        this.engine = new Engine();
        this.baseSystem = new BaseSystem(this.engine);
        // Create systems
        this.engine = new EngineBuilder(this.engine)
            .addSystem(new MovementSystem(this.engine))
            .withGroup('actions')
            .addSystem(new FovSystem(this.engine))
            .withGroup('fov')
            .addSystem(new DungeonDisplaySystem(this.engine, this.display))
            .withGroup('display')
            .addSystem(new DisplaySystem(this.engine, this.display))
            .withGroup('display')
            .getEngine()
            ;
        // Create entities
        new EntitiesBuilder()
            .createDungeon()
            .addCreatedEntitiesToEngine(this.engine)
            ;
        const movablePositions = this.baseSystem.getMovablePositions();
        const position = movablePositions[Math.floor(Math.random() * movablePositions.length)];
        new EntitiesBuilder()
            .createPlayer(position)
            .addCreatedEntitiesToEngine(this.engine)
            ;
    }
    /**
     * Handle events
     * @param event event for handle
     */
    handleEvent(event: Event) {
        if (event.type == 'keydown') {
            const keyboardEvent = event as KeyboardEvent;
            const direction = this.directionByKey[keyboardEvent.code];
            if (!direction) {
                return;
            }
            const entity = this.engine.getEntitiesOfTheseComponents(
                PlayerComponent, MoveDirectionComponent
            )[0];
            entity.get(MoveDirectionComponent).setX(direction.x).setY(direction.y);
            this.update();
        }
    }
    /**
     * Bind event listeners
     */
    bindEvents() {
        document.addEventListener('keydown', this);
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
    }
}
