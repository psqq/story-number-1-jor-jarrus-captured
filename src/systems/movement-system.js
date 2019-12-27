import Victor from 'victor';
import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import MoveDirectionComponent from "../components/move-direction-component";
import BaseSystem from "./base-system";
import Position2DComponent from "../components/position-2d-component";
import DeepComponent from "../components/deep-compnent";

export default class MovementSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.movableEntities = new SmartEntitiesContainer(engine, [
            MoveDirectionComponent, Position2DComponent, DeepComponent
        ]);
    }
    erase() {
        super.erase();
        this.movableEntities.erase();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let entity of this.movableEntities.getEnties()) {
            const positionComp = entity.get(Position2DComponent);
            const deepComp = entity.get(DeepComponent);
            const moveDirectionComp = entity.get(MoveDirectionComponent);
            const newPosition =
                new Victor().copy(positionComp).add(moveDirectionComp);
            if (this.isMovablePosition(newPosition, deepComp.deep)) {
                positionComp.x = newPosition.x;
                positionComp.y = newPosition.y;
            }
            moveDirectionComp.erase();
        }
    }
}
