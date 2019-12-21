import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import MoveDirectionComponent from "../components/move-direction-component";
import BaseSystem from "./base-system";
import PositionComponent from "../components/position-component";

export default class MovementSystem extends BaseSystem {
    private smartEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.smartEntities = new SmartEntitiesContainer(engine, [
            MoveDirectionComponent, PositionComponent
        ]);
    }
    update(deltaTime: number = 0) {
        for (let entity of this.smartEntities.getEnties()) {
            const position = entity.get(PositionComponent);
            const moveDirection = entity.get(MoveDirectionComponent);
            const newPosition = position.toVictor().clone().add(moveDirection.toVictor());
            if (this.isMovablePosition(newPosition)) {
                position.x = newPosition.x;
                position.y = newPosition.y;
            }
            moveDirection.x = moveDirection.y = 0;
        }
    }
}
