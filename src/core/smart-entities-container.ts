import Engine from "./engine";
import coreConfig from "./core-config";
import Entity from "./entity";
import EventEmitter from "wolfy87-eventemitter";
import { ComponentAddedToEntityEvent } from "../game/systems/events";

type Class = { new(...arg: any): any };

export default class SmartEntitiesContainer extends EventEmitter {
    private engine: Engine;
    private componentClasses: Class[];
    private entities: Entity[];
    constructor(engine: Engine, componentClasses: Class[]) {
        super();
        this.engine = engine;
        this.componentClasses = componentClasses;
        this.entities = [];
        this.engine.on(
            coreConfig.engineEvents.entityCreated,
            (entity: Entity) => {
                if (this.engine.hasComponents(entity.getId(), this.componentClasses)) {
                    this.entities.push(entity);
                    this.emit(coreConfig.smartEntitiesContainerEvents.changed);
                }
            }
        );
        this.engine.on(
            coreConfig.engineEvents.entityRemoved,
            (entityId: number) => {
                this.entities = this.entities.filter(x => x.getId() != entityId);
                this.emit(coreConfig.smartEntitiesContainerEvents.changed);
            }
        );
        this.engine.on(
            coreConfig.engineEvents.componentAddedToEntity,
            (event: ComponentAddedToEntityEvent) => {
                if (this.engine.hasComponents(event.entityId, this.componentClasses)) {
                    if (this.entities.findIndex(x => x.getId() == event.entityId) < 0) {
                        this.entities.push(this.engine.getEntity(event.entityId));
                        this.emit(coreConfig.smartEntitiesContainerEvents.changed);
                    }
                }
            }
        );
    }
    getEnties() {
        return this.entities;
    }
}
