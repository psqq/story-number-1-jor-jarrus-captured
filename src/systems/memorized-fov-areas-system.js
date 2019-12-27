import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import BaseSystem from "./base-system";
import Position2DComponent from "../components/position-2d-component";
import FovComponent from "../components/fov-component";
import config from "../config";
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";
import range from "../tools/range";
import DeepComponent from "../components/deep-compnent";

export default class MemorizedFovAreasSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.fovEntities = new SmartEntitiesContainer(engine, [
            FovComponent, 
            Position2DComponent, DeepComponent,
            MemorizedFovAreaComponent,
        ]);
    }
    erase() {
        super.erase();
        this.fovEntities.erase();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        for (let entity of this.fovEntities.getEnties()) {
            const positionComp = entity.get(Position2DComponent);
            const deepComp = entity.get(DeepComponent);
            const fovComp = entity.get(FovComponent);
            let memorizedFovAreaForCurrentDeep;
            for (let memorizedFovArea of entity.gets(MemorizedFovAreaComponent)) {
                if (memorizedFovArea.deep == deepComp.deep) {
                    memorizedFovAreaForCurrentDeep = memorizedFovArea;
                    break;
                }
            }
            for (let x of range(config.map.size.x)) {
                for (let y of range(config.map.size.y)) {
                    memorizedFovAreaForCurrentDeep.memorizedFovArea[x][y] =
                        memorizedFovAreaForCurrentDeep.memorizedFovArea[x][y]
                        || fovComp.fov[x][y];
                }
            }
        }
    }
}
