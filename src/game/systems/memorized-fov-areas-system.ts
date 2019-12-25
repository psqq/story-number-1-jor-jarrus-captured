import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import MoveDirectionComponent from "../components/move-direction-component";
import BaseSystem from "./base-system";
import PositionComponent from "../components/position-component";
import FovComponent from "../components/fov-component";
import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import config from "../../config";
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";
import range from "../../tools/range";

export default class MemorizedFovAreasSystem extends BaseSystem {
    private fovEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.fovEntities = new SmartEntitiesContainer(engine, [
            FovComponent, PositionComponent, MemorizedFovAreaComponent,
        ]);
    }
    clear() {
        super.clear();
        this.fovEntities.clear();
    }
    update(deltaTime: number = 0) {
        for (let entity of this.fovEntities.getEnties()) {
            const position = entity.get(PositionComponent);
            const fovComponent = entity.get(FovComponent);
            let memorizedFovAreaForCurrentDeep;
            for (let memorizedFovArea of entity.gets(MemorizedFovAreaComponent)) {
                if (memorizedFovArea.deep == position.deep) {
                    memorizedFovAreaForCurrentDeep = memorizedFovArea;
                    break;
                }
            }
            for (let x of range(config.map.size.x)) {
                for (let y of range(config.map.size.y)) {
                    memorizedFovAreaForCurrentDeep.memorizedFovArea[x][y] =
                        memorizedFovAreaForCurrentDeep.memorizedFovArea[x][y]
                        || fovComponent.fov[x][y];
                }
            }
        }
    }
}
