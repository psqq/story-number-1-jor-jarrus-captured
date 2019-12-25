import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import MoveDirectionComponent from "../components/move-direction-component";
import BaseSystem from "./base-system";
import PositionComponent from "../components/position-component";
import FovComponent from "../components/fov-component";
import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import config from "../../config";
import MemorizedFovAreaComponent from "../components/memorized-fov-area-component";

export default class FovSystem extends BaseSystem {
    private fovEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.fovEntities = new SmartEntitiesContainer(engine, [
            FovComponent, PositionComponent,
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
            const fov = new PreciseShadowcasting(this.getLightPassesCallback());
            fovComponent.fov = new Array(config.map.size.x)
                .fill(0)
                .map(x => new Array(config.map.size.y).fill(0));
            ;
            fov.compute(position.x, position.y, 8, (x, y, r, visibility) => {
                fovComponent.fov[x][y] = !!visibility;
            });
        }
    }
}
