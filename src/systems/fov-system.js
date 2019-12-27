import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import BaseSystem from "./base-system";
import Position2DComponent from "../components/position-2d-component";
import FovComponent from "../components/fov-component";
import PreciseShadowcasting from "rot-js/lib/fov/precise-shadowcasting";
import config from "../config";
import matrix from "../tools/matrix";
import DeepComponent from "../components/deep-compnent";

export default class FovSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.fovEntities = new SmartEntitiesContainer(engine, [
            FovComponent, Position2DComponent, DeepComponent
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
            const position = entity.get(Position2DComponent);
            const deepComp = entity.get(DeepComponent);
            const fovComponent = entity.get(FovComponent);
            fovComponent.fov = matrix(
                config.map.size.x, config.map.size.y,
                false,
            );
            const rotjsFov = new PreciseShadowcasting(this.getLightPassesCallback(deepComp.deep));
            rotjsFov.compute(position.x, position.y, 8, (x, y, r, visibility) => {
                fovComponent.fov[x][y] = !!visibility;
            });
        }
    }
}
