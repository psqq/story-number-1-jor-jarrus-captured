import Engine from '../core/ecs-engine/engine';
import PlayerComponent from '../components/player-component';
import With from '../tools/with';
import EnabledComponent from '../core/ecs-engine/enabled-component';

export default class Updater {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        this.engine = engine;
        this.allEntities = this.engine.getSmartEntityContainer([]);
    }
    enable(playerFlag, othersFlag) {
        for (let entity of this.allEntities.getAllEnties()) {
            if (entity.get(PlayerComponent)) {
                new With(entity.get(EnabledComponent))
                    .do(x => x.enabled = playerFlag)
            } else {
                new With(entity.get(EnabledComponent))
                    .do(x => x.enabled = othersFlag)
            }
        }
    }
    /**
     * @param {number} deltaTime 
     */
    updatePlayer(deltaTime = 0) {
        this.enable(true, false);
        this.engine.update(deltaTime);
    }
    /**
     * @param {number} deltaTime 
     */
    updateOthers(deltaTime = 0) {
        this.enable(false, true);
        this.engine.update(deltaTime);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        this.updatePlayer(deltaTime);
        this.updateOthers(deltaTime);
        this.enable(true, true);
    }
}
