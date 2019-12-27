import Engine from "./engine";
import coreConfig from "../core-config";
import Entity from "./entity";
import EventEmitter from "wolfy87-eventemitter";
import Component from "./component";

export default class SmartEntitiesContainer extends EventEmitter {
    /**
     * @param {Engine} engine 
     * @param {(new(...arg: any) => any)[]} componentClasses 
     */
    constructor(engine, componentClasses) {
        super();
        this.engine = engine;
        this.componentClasses = componentClasses;
        /** @type {Entity[]} */
        this.entities = [];
        /** @type {{ [key: string]: (...args: any[]) => any }} */
        this.listeners = {
            [coreConfig.engineEvents.entityCreated]:
                /**
                 * @param {number} entityId
                 */
                (entityId) => {
                    if (
                        this.engine.isEntityHasComponentes(entityId, this.componentClasses)
                        && this.entities.findIndex(x => x.getId() == entityId) < 0
                    ) {
                        this.entities.push(this.engine.getEntityById(entityId));
                        this.emit(coreConfig.smartEntitiesContainerEvents.changed);
                    }
                },
            [coreConfig.engineEvents.entityRemoved]:
                /**
                 * @param {number} entityId
                 */
                (entityId) => {
                    this.entities = this.entities.filter(x => x.getId() != entityId);
                    this.emit(coreConfig.smartEntitiesContainerEvents.changed);
                },
            [coreConfig.engineEvents.componentAddedToEntity]:
                /**
                 * @param {number} entityId
                 * @param {Component} component
                 */
                (entityId, component) => {
                    if (this.engine.isEntityHasComponentes(entityId, this.componentClasses)) {
                        if (this.entities.findIndex(x => x.getId() == entityId) < 0) {
                            const entity = this.engine.getEntityById(entityId);
                            this.entities.push(entity);
                            this.emit(coreConfig.smartEntitiesContainerEvents.changed);
                        }
                    }
                }
        };
        for (let eventName in this.listeners) {
            this.engine.on(eventName, this.listeners[eventName]);
        }
    }
    /**
     * Destructor
     */
    erase() {
        for (let eventName in this.listeners) {
            this.engine.off(eventName, this.listeners[eventName]);
        }
        for (let entity of this.entities) {
            entity.erase();
        }
    }
    /**
     * @param {number} id 
     */
    getEntityById(id) {
        for (let entity of this.entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
    }
    getEnties() {
        return this.entities;
    }
}
