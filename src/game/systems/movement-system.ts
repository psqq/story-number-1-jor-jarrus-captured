import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import MoveDirectionComponent from "../components/move-direction-component";
import BaseSystem from "./base-system";
import PositionComponent from "../components/position-component";
import EntitiesBuilder from "../entities-builder";
import getRandomElement from "../../tools/get-random-element";
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";
import matrix from "../../tools/matrix";
import config from "../../config";

export default class MovementSystem extends BaseSystem {
    private movableEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.movableEntities = new SmartEntitiesContainer(engine, [
            MoveDirectionComponent, PositionComponent
        ]);
    }
    update(deltaTime: number = 0) {
        for (let entity of this.movableEntities.getEnties()) {
            const position = entity.get(PositionComponent);
            const moveDirection = entity.get(MoveDirectionComponent);
            if (moveDirection.depthChange != null) {
                const stairs = this.getStairs(moveDirection.depthChange);
                if (!stairs.get(PositionComponent).toVictor().isEqualTo(position.toVictor())) {
                    continue;
                }
                const newDeep = position.deep + moveDirection.depthChange;
                if (this.getDungeon(newDeep) == null) {
                    new EntitiesBuilder()
                        .createDungeon(newDeep)
                        .addCreatedEntitiesToEngine(this.engine);
                    this.engine.addComponentToEntity(
                        this.getPlayer().getId(),
                        new MemorizedFovAreaComponent()
                            .setMemorizedFovArea(
                                matrix(config.map.size.x, config.map.size.y, false)
                            )
                            .setDeep(newDeep),
                    );
                }
                let newPosition = getRandomElement(this.getMovablePositions(newDeep));
                position
                    .setDeep(newDeep)
                    .setX(newPosition.x)
                    .setY(newPosition.y);
            } else {
                const newPosition = position.toVictor().clone().add(moveDirection.toVictor());
                if (this.isMovablePosition(newPosition, position.deep)) {
                    position.x = newPosition.x;
                    position.y = newPosition.y;
                }
                moveDirection.clear();
            }
        }
    }
}
