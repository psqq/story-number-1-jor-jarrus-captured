import Engine from "./engine";
import coreConfig from "./core-config";
import Entity from "./entity";
import Component from "./component";
import EventEmitter from "wolfy87-eventemitter";
import { ComponentAddedToEntityEvent } from "../game/systems/events";

type Class = { new(...arg: any): any };

export default class SmartEntitiesContainer extends EventEmitter {
    private engine: Engine;
    private components: Class[];
    private entities: Entity[];
    constructor(engine: Engine, components: Class[]) {
        super();
        this.engine = engine;
        this.components = components;
        this.entities = [];
        this.engine.on(coreConfig.engineEvents.entityCreated, (entity: Entity) => {
            if (this.engine.hasComponents(entity.getId(), this.components)) {
                this.entities.push(entity);
                this.emit(coreConfig.smartEntitiesContainerEvents.changed);
            }
        });
        this.engine.on(
            coreConfig.engineEvents.componentAddedToEntity,
            (event: ComponentAddedToEntityEvent) => {
                if (components.indexOf(event.component.constructor as Class) >= 0) {
                    for(let entity of this.entities) {
                        if (entity.getId() === event.entityId) {
                            entity.addComponent(event.component);
                        }
                    }
                }
            }
        );
        this.engine.on(coreConfig.engineEvents.entityRemoved, (entity: Entity) => {
            this.entities = this.entities.filter(x => x.getId() != entity.getId());
            this.emit(coreConfig.smartEntitiesContainerEvents.changed);
        });
    }
    getEnties() {
        return this.entities;
    }
}
