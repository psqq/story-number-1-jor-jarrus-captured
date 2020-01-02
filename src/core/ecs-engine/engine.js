import System from "./system";
import Component from "./component";
import getuid from "../../tools/getuid";
import Entity from "./entity";
import EventEmitter from "wolfy87-eventemitter";
import coreConfig from "../core-config";
import SmartEntitiesContainer from "./smart-entities-container";
import EnabledComponent from './enabled-component';
import With from '../../tools/with';

export default class Engine extends EventEmitter {
    constructor() {
        super();
        // Systems
        /** @type {System[]} */
        this.systems = [];
        /** @type {Map<string, Set<System>>} */
        this.systemGroups = new Map();
        this.priorityForNextSystem = 0;
        // Entiteis
        /** @type {Map<number, Map<string, Component[]>>} */
        this.entities = new Map();
        /** @type {SmartEntitiesContainer[]} */
        this.smartEntityConatiners = [];
        this.allEntities = this.getSmartEntityContainer();
        /** @type {Map<string, Set<Entity>>} */
        this.entityGroups = new Map();
        // Components
        /** @type {Map<string, new(...args:any[]) => Component>} */
        this.registeredComponentClasses = new Map();
        this.registerComponentClass(EnabledComponent);
    }
    getAllEntities() {
        const allEntities = [];
        for (let entityId of this.entities.keys()) {
            allEntities.push(this.getEntityById(entityId));
        }
        return allEntities;
    }
    /**
     * @param {{[key: string]: (new(...args:any[]) => Component)[]}} options
     * @returns {{[key: string]: SmartEntitiesContainer}}
     */
    getSmartEntityContainers(options) {
        const result = {};
        for (let key in options) {
            result[key] = this.getSmartEntityContainer(options[key]);
        }
        return result;
    }
    /**
     * @param {(new(...args:any[]) => Component)[]} ComponentClasses 
     */
    getSmartEntityContainer(ComponentClasses) {
        const container = new SmartEntitiesContainer(this, ComponentClasses);
        this.smartEntityConatiners.push(container);
        return container;
    }
    erase() {
        // Systems
        for (let system of this.systems) {
            system.erase();
        }
        this.systems = [];
        this.systemGroups = new Map();
        this.priorityForNextSystem = 0;
        // Entiteis
        for (let entityId of this.entities.keys()) {
            this.removeEntity(entityId);
        }
        this.entities = new Map();
        this.entityGroups = new Map();
        for (let container of this.smartEntityConatiners) {
            container.erase();
        }
        this.smartEntityConatiners = [];
        this.allEntities = this.getSmartEntityContainer();
        // Components
        this.registeredComponentClasses = new Map();
        this.registerComponentClass(EnabledComponent);
    }
    /**
     * @param {number} entityId 
     */
    isEntity(entityId) {
        return this.entities.has(entityId);
    }
    /**
     * @param {number} entityId 
     */
    getEntityById(entityId) {
        if (entityId == null) {
            return;
        }
        const components = this.entities.get(entityId);
        const entity = new Entity(entityId, components, this);
        return entity;
    }
    /**
     * @param {number} entityId 
     * @param {Component} ComponentClass 
     */
    isEntityHasComponent(entityId, ComponentClass) {
        if (!ComponentClass) {
            return true;
        }
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
        if (!ComponentClasses) {
            return true;
        }
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
     * @param {string[]} groups 
     */
    addSystem(system, groups) {
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
        if (!groups) {
            groups = [];
        }
        groups = [...groups];
        groups.push('system');
        for (let group of groups) {
            if (!this.systemGroups.has(group)) {
                this.systemGroups.set(group, new Set());
            }
            this.systemGroups.get(group).add(system);
        }
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
     * @param {(new(...args:any[]) => Component)[]} ComponentClasses 
     */
    registerComponentClasses(ComponentClasses) {
        for (let ComponentClass of ComponentClasses) {
            this.registerComponentClass(ComponentClass);
        }
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
     * @param {string[]} groups 
     */
    createEntity(components, groups) {
        let entityId = getuid();
        this.createEntityWithId(entityId, components, groups);
    }
    /**
     * @param {number} entityId 
     * @param {Component[]} components 
     * @param {string[]} groups 
     */
    createEntityWithId(entityId, components, groups) {
        components.push(
            new With(new EnabledComponent())
                .do(x => x.enabled = true)
                .finish()
        );
        this.entities.set(entityId, new Map());
        for (let component of components) {
            this.addComponentToEntity(entityId, component);
        }
        groups = groups || [];
        groups = [...groups];
        groups.push('entity');
        for (let group of groups) {
            if (!this.entityGroups.has(group)) {
                this.entityGroups.set(group, new Set());
            }
            this.entityGroups.get(group).add(entityId);
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
     * @param {System[]} systems 
     * @param {number} deltaTime 
     */
    updateSystems(systems, deltaTime = 0) {
        for (let system of systems) {
            system.update(deltaTime);
        }
    }
    /**
     * @param {string[]} includeGroups 
     * @param {string[]} excludeGroups 
     * @param {number} deltaTime 
     */
    updateSystemGroups(includeGroups, excludeGroups, deltaTime = 0) {
        let systems = new Set();
        for (let group of includeGroups) {
            systems = new Set([...systems, ...this.systemGroups.get(group)]);
        }
        for (let group of excludeGroups) {
            systems = new Set([...systems].filter(x => !this.systemGroups.get(group).has(x)));
        }
        this.updateSystems(systems, deltaTime);
    }
    /**
     * @param {System[]} systems 
     * @param {number} deltaTime 
     */
    update(deltaTime = 0) {
        this.updateSystems(this.systems, deltaTime);
    }
    getEntityData(entityId) {
        const componentsOfEntity = this.entities.get(entityId);
        const data = {};
        for (let [nameOfComponentClass, components] of componentsOfEntity) {
            data[nameOfComponentClass] = [];
            for (let component of components) {
                data[nameOfComponentClass].push(component);
            }
        }
        return data;
    }
    toString() {
        const data = { entities: {} };
        for (let entityId of this.entities.keys()) {
            data.entities[entityId] = this.getEntityData(entityId);
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
