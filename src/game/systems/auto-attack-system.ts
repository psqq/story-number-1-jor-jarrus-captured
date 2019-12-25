import Engine from "../../core/engine";
import SmartEntitiesContainer from "../../core/smart-entities-container";
import BaseSystem from "./base-system";
import IdComponent from "../components/id-component";
import AutoAttackComponent from "../components/auto-attack-component";
import PhysicalDamageComponent from "../components/physical-damage-component";
import HealthPointsComponent from "../components/health-points-component";
import Entity from "../../core/entity";

export default class AutoAttackSystem extends BaseSystem {
    private attackableEntities: SmartEntitiesContainer;
    private protectableEntities: SmartEntitiesContainer;
    private autoAttacksEntities: SmartEntitiesContainer;
    constructor(engine: Engine) {
        super(engine);
        this.attackableEntities = new SmartEntitiesContainer(engine, [
            IdComponent, PhysicalDamageComponent,
        ]);
        this.protectableEntities = new SmartEntitiesContainer(engine, [
            IdComponent, HealthPointsComponent,
        ]);
        this.autoAttacksEntities = new SmartEntitiesContainer(engine, [
            AutoAttackComponent
        ]);
    }
    clear() {
        super.clear();
        this.attackableEntities.clear();
        this.protectableEntities.clear();
        this.autoAttacksEntities.clear();
    }
    getById(id: number, entities: Entity[]): Entity {
        for (let entity of entities) {
            if (entity.get(IdComponent).id == id) {
                return entity;
            }
        }
    }
    update(deltaTime: number = 0) {
        for (let aaEntity of this.autoAttacksEntities.getEnties()) {
            const aaComp = aaEntity.get(AutoAttackComponent);
            const attacker = this.getById(aaComp.attackingId, this.attackableEntities.getEnties());
            const protecter = this.getById(aaComp.protectingId, this.protectableEntities.getEnties());
            if (!attacker || !protecter) {
                this.engine.removeEntity(aaEntity.getId());
                continue;
            }
            protecter.get(HealthPointsComponent).currentHealthPoints -=
                attacker.get(PhysicalDamageComponent).currentPhysicalDamage;
            this.engine.removeEntity(aaEntity.getId());
        }
    }
}
