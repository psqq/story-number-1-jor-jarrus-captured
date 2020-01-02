import Victor from 'victor';
import Engine from "../core/ecs-engine/engine";
import SmartEntitiesContainer from "../core/ecs-engine/smart-entities-container";
import MoveDirection2DComponent from "../components/move-direction-2d-component";
import BaseSystem from "./base-system";
import Position2DComponent from "../components/position-2d-component";
import DeepComponent from "../components/deep-compnent";
import HeroQSkillComponent from '../components/hero-qskill-component';
import around from '../tools/around-positions';
import PhysicalDamageComponent from '../components/physical-damage-component';
import config from '../config';

export default class MovementSystem extends BaseSystem {
    /**
     * @param {Engine} engine 
     */
    constructor(engine) {
        super(engine);
        this.movableEntities = this.engine.getSmartEntityContainer([
            MoveDirection2DComponent, Position2DComponent, DeepComponent
        ]);
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        for (let entity of this.movableEntities.getEnabledEnties()) {
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
            const heroQSkill = entity.get(HeroQSkillComponent);
            if (heroQSkill) {
                // if (heroQSkill.duration > 0) {
                //     for (let p of around(newPosition)) {
                //         const enemy = this.getTeamBeing(p);
                //         if (enemy != null && enemy.get(TeamComponent).teamName === 'goblins') {
                //             this.engine.createEntity([
                //                 new With(new DamageComponent())
                //                     .do(x => {
                //                         x.sourceId = entity.getId();
                //                         x.targetId = enemy.getId();
                //                         x.physicalDamage =
                //                             heroQSkill.damage *
                //                             entity.get(PhysicalDamageComponent)
                //                                 .currentPhysicalDamage;
                //                         x.trueDamage = 0;
                //                         x.magicDamage = 0;
                //                     })
                //                     .finish()
                //             ]);
                //         }
                //     }
                // }
            }
            positionComp.x = newPosition.x;
            positionComp.y = newPosition.y;
            moveDirectionComp.erase();
        }
    }
}
