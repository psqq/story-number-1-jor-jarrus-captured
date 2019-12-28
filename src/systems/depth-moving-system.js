import Victor from 'victor';
import Engine from "../core/ecs-engine/engine";
import BaseSystem from "./base-system";
import Position2DComponent from "../components/position-2d-component";
import EntitiesBuilder from "../entities-builder";
import getRandomElement from "../tools/get-random-element";
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";
import matrix from "../tools/matrix";
import config from "../config";
import DepthMovingComponent from "../components/depth-moving-component";
import DeepComponent from '../components/deep-compnent';

export default class DepthMovingSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
    }
    erase() {
        super.erase();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        const entity = this.getPlayer();
        const positionComp = entity.get(Position2DComponent);
        const deepComp = entity.get(DeepComponent);
        const deep = deepComp.deep;
        const depthMovingComp = entity.get(DepthMovingComponent);
        const stairs = this.getStairs(depthMovingComp.toDeep, deepComp.deep);
        if (depthMovingComp.toDeep == null) {
            return;
        }
        if (
            new Victor()
                .copy(stairs.get(Position2DComponent))
                .isEqualTo(positionComp) == false
        ) {
            return;
        }
        const newDeep = depthMovingComp.toDeep;
        if (this.getDungeon(newDeep) == null) {
            new EntitiesBuilder()
                .createDungeon(newDeep)
                .addCreatedEntitiesToEngine(this.engine);
            this.engine.addComponentToEntity(
                this.getPlayer().getId(),
                new MemorizedFovAreaComponent()
                    .setup({
                        memorizedFovArea: matrix(config.map.size.x, config.map.size.y, false),
                        deep: newDeep
                    })
            );
        }
        const stairsBack = this.getStairs(deep, newDeep);
        let newPosition;
        if (stairsBack) {
            newPosition = stairsBack.get(Position2DComponent);
        } else {
            newPosition = getRandomElement(this.getMovablePositions(newDeep));
        }
        positionComp
            .setup({
                x: newPosition.x,
                y: newPosition.y,
            });
        deepComp
            .setup({
                deep: newDeep
            });
        depthMovingComp
            .setup({
                toDeep: null
            });
    }
}
