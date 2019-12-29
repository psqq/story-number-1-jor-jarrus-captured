import Victor from 'victor';
import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import MoveDirection2DComponent from "../components/move-direction-2d-component";
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
            MoveDirection2DComponent, Position2DComponent, DeepComponent
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
            const moveDirectionComp = entity.get(MoveDirection2DComponent);
            const newPosition =
                new Victor().copy(positionComp).add(moveDirectionComp);
            if (!this.isMovablePosition(newPosition, deepComp.deep)) {
                moveDirectionComp.erase();
                continue;
            }
            if (deltaTime <= 0) {
                return;
            }
            positionComp.x = newPosition.x;
            positionComp.y = newPosition.y;
            moveDirectionComp.erase();
        }
    }
}
