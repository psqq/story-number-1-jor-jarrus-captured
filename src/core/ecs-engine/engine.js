import System from "./system";
import Component from "./component";
import getuid from "../../tools/getuid";
import Entity from "./entity";
import EventEmitter from "wolfy87-eventemitter";
import coreConfig from "../core-config";
import SmartEntitiesContainer from "./smart-entities-container";

export default class Engine extends EventEmitter {
    constructor() {
        super();
        /** @type {System[]} */
        this.systems = [];
        this.priorityForNextSystem = 0;
        /** @type {Map<number, Map<string, Component[]>>} */
        this.entities = new Map();
        /** @type {Map<string, new(...args:any[]) => Component>} */
        this.registeredComponentClasses = new Map();
        /** @type {SmartEntitiesContainer[]} */
        this.smartEntityConatiners = [];
    }
    /**
     * @param {{[key: string]: (new(...args:any[]) => Component)[]}} options
     * @returns {{[key: string]: SmartEntitiesContainer}}
     */
    getSmartEntityContainers(options) {
        const result = {};
        for(let key in options) {
            result[key] = new SmartEntitiesContainer(this, options[key]);
        }
        return result;
    }
    /**
     * @param {(new(...args:any[]) => Component)[]} ComponentClasses 
     */
    getSmartEntityContainer(ComponentClasses) {
        return new SmartEntitiesContainer(this, ComponentClasses);
    }
    erase() {
        for (let system of this.systems) {
            system.erase();
        }
        this.systems = [];
        this.priorityForNextSystem = 0;
        for (let entityId of this.entities.keys()) {
            this.removeEntity(entityId);
        }
        this.entities = new Map();
        this.registeredComponentClasses = new Map();
        for(let container of this.smartEntityConatiners) {
            container.erase();
        }
        this.smartEntityConatiners = [];
    }
    /**
     * @param {number} entityId 
     */
    getEntityById(entityId, ComponentClasses) {
        const components = this.entities.get(entityId);
        const entity = new Entity(entityId, components, this, ComponentClasses);
        return entity;
    }
    /**
     * @param {number} entityId 
     * @param {Component} ComponentClass 
     */
    isEntityHasComponent(entityId, ComponentClass) {
        const nameOfComponentClass = this.getNameOfComponentClass(ComponentClass);
        if (!this.entities.get(entityId).has(nameOfComponentClass)) {
            return false;
        }
        return this.entities.get(entityId).get(nameOfComponentClass).length > 0;
    }
    /**
     * @param {number} entityId 
     * @param {Component[]} ComponentClasses 
     */
    isEntityHasComponentes(entityId, ComponentClasses) {
        for (let ComponentClass of ComponentClasses) {
            if (!this.isEntityHasComponent(entityId, ComponentClass)) {
                return false;
            }
        }
        return true;
    }
    /**
     * @param {Component[]} ComponentClasses 
     */
    getEntityWithComponents(ComponentClasses) {
        for (let entityId of this.entities.keys()) {
            if (this.isEntityHasComponentes(entityId, ComponentClasses)) {
                return this.getEntityById(entityId);
            }
        }
        return null;
    }
    /**
     * @param {System} system 
     */
    addSystem(system) {
        if (system.engine != null && system.engine !== this) {
            throw "System is already in some system";
        }
        system.setup({
            engine: this,
        });
        if (system.priority == null) {
            system.priority = this.priorityForNextSystem;
            this.priorityForNextSystem -= 1;
        }
        this.systems.push(system);
    }
    /**
     * @param {new(...args:any[]) => Component} ComponentClass 
     */
    getNameOfComponentClass(ComponentClass) {
        return ComponentClass.name;
    }
    /**
     * @param {new(...args:any[]) => Component} ComponentClass 
     */
    registerComponentClass(ComponentClass) {
        const nameOfComponentClass = this.getNameOfComponentClass(ComponentClass);
        if (this.registeredComponentClasses.has(nameOfComponentClass)) {
            throw "The component is already registered";
        }
        this.registeredComponentClasses
            .set(nameOfComponentClass, ComponentClass);
    }
    /**
     * @param {new(...args:any[]) => Component} ComponentClass 
     */
    isComponentClassRegistered(ComponentClass) {
        return this.registeredComponentClasses
            .get(this.getNameOfComponentClass(ComponentClass)) === ComponentClass;
    }
    /**
     * @param {number} entityId 
     * @param {Component} component 
     */
    addComponentToEntity(entityId, component) {
        const ComponentClass = component.constructor;
        const nameOfComponentClass = this.getNameOfComponentClass(ComponentClass);
        if (!this.isComponentClassRegistered(ComponentClass)) {
            throw "This class of component is not registered: " + nameOfComponentClass;
        }
        if (!this.entities.has(entityId)) {
            throw "No entity for adding component: " + nameOfComponentClass;
        }
        if (!this.entities.get(entityId).get(nameOfComponentClass)) {
            this.entities.get(entityId).set(nameOfComponentClass, []);
        }
        this.entities.get(entityId).get(nameOfComponentClass).push(component);
        this.emit(coreConfig.engineEvents.componentAddedToEntity, entityId, component);
    }
    /**
     * @param {Component[]} components 
     */
    createEntity(components) {
        let entityId = getuid();
        this.createEntityWithId(entityId, components);
    }
    /**
     * @param {Component[]} components 
     */
    createEntityWithId(entityId, components) {
        this.entities.set(entityId, new Map());
        for (let component of components) {
            this.addComponentToEntity(entityId, component);
        }
        this.emit(coreConfig.engineEvents.entityCreated, entityId);
        return entityId;
    }
    /**
     * @param {number} entityId 
     * @param {new(...args:any[]) => T} ComponentClass 
     * @returns {T}
     * @template T
     */
    getComponentsOfEntity(entityId, ComponentClass) {
        if (!this.entities.has(entityId)) {
            throw "No entity with this id " + entityId;
        }
        return this.entities.get(entityId).get(ComponentClass.name);
    }
    /**
     * @param {number} entityId 
     */
    removeEntity(entityId) {
        if (!this.entities.has(entityId)) {
            throw "No entity with this id " + entityId;
        }
        this.entities.delete(entityId);
        this.emit(coreConfig.engineEvents.entityRemoved, entityId);
    }
    /**
     * @param {number} dt 
     */
    update(dt = 0) {
        for (let system of this.systems) {
            system.update(dt);
        }
    }
    toString() {
        const data = { entities: {} };
        for (let [entityId, componentsOfEntity] of this.entities) {
            data.entities[entityId] = {};
            for (let [nameOfComponentClass, components] of componentsOfEntity) {
                data.entities[entityId][nameOfComponentClass] = [];
                for (let component of components) {
                    data.entities[entityId][nameOfComponentClass].push(
                        component
                    );
                }
            }
        }
        return JSON.stringify(data);
    }
    /**
     * @param {string} dataString 
     */
    fromString(dataString) {
        /** @type {{entities: {[key:number]: {[key:string]: any[]}}}} */
        const data = JSON.parse(dataString);
        for (let entityId in data.entities) {
            const components = [];
            for (let nameOfComponentClass in data.entities[entityId]) {
                const componentsData = data.entities[entityId][nameOfComponentClass];
                for (let componentData of componentsData) {
                    const ComponentClass = this.registeredComponentClasses.get(nameOfComponentClass);
                    let component = new ComponentClass();
                    component.setup(componentData);
                    components.push(component);
                }
            }
            this.createEntityWithId(entityId, components);
        }
    }
}
