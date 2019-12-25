import Engine from "./engine";
import coreConfig from "./core-config";
import Entity from "./entity";
import EventEmitter from "wolfy87-eventemitter";
import { ComponentAddedToEntityEvent } from "./events";

type Class = { new(...arg: any): any };

export default class SmartEntitiesContainer extends EventEmitter {
    private engine: Engine;
    private componentClasses: Class[];
    private entities: Entity[];
    private listeners: { [key: string]: (...args: any[]) => any };
    constructor(engine: Engine, componentClasses: Class[]) {
        super();
        this.engine = engine;
        this.componentClasses = componentClasses;
        this.entities = [];
        let self = this;
        self.listeners = {
            [coreConfig.engineEvents.entityCreated]:
                (entity: Entity) => {
                    if (self.engine.hasComponents(entity.getId(), self.componentClasses)) {
                        self.entities.push(entity);
                        self.emit(coreConfig.smartEntitiesContainerEvents.changed);
                    }
                },
            [coreConfig.engineEvents.entityRemoved]:
                (entityId: number) => {
                    self.entities = self.entities.filter(x => x.getId() != entityId);
                    self.emit(coreConfig.smartEntitiesContainerEvents.changed);
                },
            [coreConfig.engineEvents.componentAddedToEntity]:
                (event: ComponentAddedToEntityEvent) => {
                    if (self.engine.hasComponents(event.entityId, self.componentClasses)) {
                        if (self.entities.findIndex(x => x.getId() == event.entityId) < 0) {
                            const entity = self.engine.getEntity(event.entityId);
                            self.entities.push(entity);
                            self.emit(coreConfig.smartEntitiesContainerEvents.changed);
                        }
                    }
                }
        };
        for (let eventName in this.listeners) {
            this.engine.on(eventName, this.listeners[eventName]);
        }
    }
    clear() {
        for (let eventName in this.listeners) {
            this.engine.off(eventName, this.listeners[eventName]);
        }
        for(let entity of this.entities) {
            entity.clear();
        }
    }
    getEnties() {
        return this.entities;
    }
}
