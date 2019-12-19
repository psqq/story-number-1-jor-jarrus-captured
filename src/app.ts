import * as rot from 'rot-js';
import config from './config';

export default class App {

    display: rot.Display = null;
    appElement: HTMLDivElement = null;
    
    constructor() {
        // Export app for debuging
        window['app'] = this;
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
        body.style.margin = "0";
        body.innerHTML = '';
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
    }
    /**
     * Launches the application.
     */
    run() {
    }
}
