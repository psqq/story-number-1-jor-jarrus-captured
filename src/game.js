import * as ecs from "./ecs";

export default class Game {
    constructor(app) {
        this.app = app;
        this.engine = new ecs.Engine();
    }
    createNewGame() {}
}
