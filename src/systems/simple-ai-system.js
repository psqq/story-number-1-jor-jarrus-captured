import Victor from 'victor';
import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import MoveDirection2DComponent from "../components/move-direction-2d-component";
import BaseSystem from "./base-system";
import Position2DComponent from "../components/position-2d-component";
import DeepComponent from "../components/deep-compnent";
import SimpleAiComponent from '../components/simple-ai-component';
import FovComponent from '../components/fov-component';
import Dijkstra from 'rot-js/lib/path/dijkstra';
import EntitiesBuilder from '../entities-builder';
import With from '../tools/with';
import AutoAttackComponent from '../components/auto-attack-component';

export default class SimpleAiSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.aiEntities = new SmartEntitiesContainer(engine, [
            SimpleAiComponent, DeepComponent, Position2DComponent,
            MoveDirection2DComponent,
        ]);
    }
    erase() {
        super.erase();
        this.aiEntities.erase();
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        if (deltaTime <= 0) {
            return;
        }
        const player = this.getPlayer();
        if (!player) {
            return;
        }
        const playerFov = this.getPlayerFov().fov;
        const playerPos = this.getPosition(player);
        for (let aiEntity of this.aiEntities.getEnabledEnties()) {
            if (aiEntity.get(DeepComponent).deep != player.get(DeepComponent).deep) {
                continue;
            }
            if (!this.isAlive(aiEntity)) {
                continue;
            }
            const aiPos = new Victor().copy(aiEntity.get(Position2DComponent));
            if (playerFov[aiPos.x][aiPos.y]) {
                var dijkstra = new Dijkstra(
                    playerPos.x, playerPos.y,
                    this.getPassableCallbackForEntity(aiEntity)
                );
                let nextPos = 0;
                dijkstra.compute(
                    aiPos.x, aiPos.y,
                    (x, y) => {
                        if (nextPos === 0) {
                            nextPos = 1;
                        } else if (nextPos === 1) {
                            nextPos = new Victor(x, y);
                        }
                    }
                );
                aiEntity.get(SimpleAiComponent)
                    .setup({
                        target: {
                            x: nextPos.x,
                            y: nextPos.y,
                        }
                    });
            } else {
            }
            const target = aiEntity.get(SimpleAiComponent).target;
            if (!target || target.x == null || target.y == null) {
                continue;
            }
            if (playerPos.isEqualTo(target)) {
                new With(aiEntity.get(AutoAttackComponent))
                    .do(x => x.targetId = player.getId());
            } else {
                const direction =
                    new Victor().copy(target)
                        .subtract(aiPos);
                new With(aiEntity.get(MoveDirection2DComponent))
                    .do(dir => {
                        dir.x = direction.x;
                        dir.y = direction.y;
                    });
            }
        }
    }
}
