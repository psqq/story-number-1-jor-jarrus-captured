import System from "./system";
import EventEmmiter from "wolfy87-eventemitter";
import Component from "./component";
import getuid from "./getuid";
import Entity from "./entity";
import coreConfig from "./core-config";

type EntityId = number;
type SystemGroups = Map<string, System[]>;
type Entities = Map<EntityId, Map<string, Component[]>>;
type Components = Map<string, Set<number>>;
type Class<T> = new () => T;

interface ComponentsSaveData {
    [key: string]: any[],
};

interface SaveData {
    entities: {
        entityId: number,
        components: ComponentsSaveData,
    }[]
};

export default class Engine extends EventEmmiter {
    private systems: System[];
    private systemGroups: SystemGroups;
    private entities: Entities;
    private components: Components;
    private killedEntities: Set<EntityId>;
    /**
     * Constructor
     */
    constructor() {
        super();
        this.systems = [];
        this.systemGroups = new Map();
        this.entities = new Map();
        this.components = new Map();
        this.killedEntities = new Set();
    }
    clear() {
        this.clearEntities();
        for (let system of this.systems) {
            system.clear();
        }
    }
    clearEntities() {
        for (let entityId of this.entities.keys()) {
            this.emit(coreConfig.engineEvents.entityRemoved, entityId);
        }
        this.entities = new Map();
        this.components = new Map();
        this.killedEntities = new Set();
    }
    getEntity(entityId: number): Entity {
        let components: Component[] = [];
        if (!this.entities.has(entityId)) {
            return;
        }
        for (let componentsOfClass of this.entities.get(entityId).values()) {
            for (let component of componentsOfClass) {
                components.push(component);
            }
        }
        return new Entity(entityId, this, components);
    }
    /**
     * Adding component to entity
     * @param entityId entity for adding component
     * @param component component for adding
     */
    addComponentToEntity(entityId: EntityId, component: Component) {
        let ComponentClass = component.constructor;
        if (!this.components.has(ComponentClass.name)) {
            this.components.set(ComponentClass.name, new Set());
        }
        this.components.get(ComponentClass.name).add(entityId);
        if (!this.entities.has(entityId)) {
            this.entities.set(entityId, new Map());
        }
        if (!this.entities.get(entityId).get(ComponentClass.name)) {
            this.entities.get(entityId).set(ComponentClass.name, []);
        }
        this.entities.get(entityId).get(ComponentClass.name).push(component);
        this.emit(
            coreConfig.engineEvents.componentAddedToEntity,
            {
                entityId, component
            }
        );
    }
    /**
     * Create new entity
     * @param components components of new entity
     */
    private createEmptyEntity(entityId: EntityId) {
        if (this.entities.has(entityId)) {
            this.emit(coreConfig.engineEvents.entityRemoved, entityId);
        }
        this.entities.set(entityId, new Map());
        this.emit(
            coreConfig.engineEvents.entityCreated,
            new Entity(entityId, this, [])
        );
    }
    /**
     * Create new entity
     * @param components components of new entity
     */
    createEntity(...components: Component[]): EntityId {
        let entityId: EntityId = getuid();
        for (let component of components) {
            this.addComponentToEntity(entityId, component);
        }
        this.emit(
            coreConfig.engineEvents.entityCreated,
            new Entity(entityId, this, components)
        );
        return entityId;
    }
    /**
     * Removing entity by id
     * @param entityId
     */
    removeEntity(entityId: EntityId) {
        this.emit(coreConfig.engineEvents.entityRemoved, entityId);
        this.entities.delete(entityId);
        for (let components of this.components.values()) {
            components.delete(entityId);
        }
    }
    /**
     * Check has entity component class
     * @param entity entity for checking
     * @param ComponentClass Component class for checking
     */
    hasComponent<T>(entity: EntityId, ComponentClass: Class<T>) {
        return this.entities.get(entity).has(ComponentClass.name);
    }
    /**
     * Check has entity component classes
     * @param entity entity for checking
     * @param ComponentClasses Component classes for checking
     */
    hasComponents<T>(entity: EntityId, ComponentClasses: Class<T>[]) {
        for (let ComponentClass of ComponentClasses) {
            if (!this.hasComponent(entity, ComponentClass)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Find entities with these component classes
     * @param ComponentClasses Classes of components for find
     */
    *_getComponents<T>(...ComponentClasses: Class<T>[]): Generator<[EntityId, T[]]> {
        for (let entity of this.entities.keys()) {
            if (this.hasComponents(entity, ComponentClasses)) {
                let components: Component[] = [];
                for (let ComponentClass of ComponentClasses) {
                    components = components.concat(this.entities.get(entity).get(ComponentClass.name));
                }
                yield [entity, components as T[]];
            }
        }
    }
    /**
     * Find entities with these component classes
     * @param ComponentClasses Classes of components for find
     */
    *iterEntitiesOfTheseComponents<T>(...ComponentClasses: Class<T>[]): Generator<Entity> {
        for (let [entityId, components] of this._getComponents(...ComponentClasses)) {
            let entity = new Entity(entityId, this, components);
            yield entity;
        }
    }
    /**
     * Find entities with these component classes
     * @param ComponentClasses Classes of components for find
     */
    getEntitiesOfTheseComponents<T>(...ComponentClasses: Class<T>[]): Entity[] {
        return [...this.iterEntitiesOfTheseComponents(...ComponentClasses)];
    }
    /**
     * Add system to group
     * @param system system for adding
     * @param groupName group for adding
     */
    _addSystemToGroup(system: System, groupName: string = '') {
        if (!this.systemGroups.has(groupName)) {
            this.systemGroups.set(groupName, []);
        }
        this.systemGroups.get(groupName).push(system);
        this.sortSystemsByPriority(this.systemGroups.get(groupName));
    }
    /**
     * Adding Systems to the Engine
     * @param system system for add
     * @param priority priority
     * @param groupName Name of the group the system will be in
     */
    addSystem(system: System, priority: number = 0, groupName: string = null) {
        system.setPriority(priority);
        this.systems.push(system);
        this.sortSystemsByPriority(this.systems);
        if (groupName !== null) {
            this._addSystemToGroup(system, groupName);
        }
        // Sort all system on priotiy changed in a system
        let self = this;
        system.on(
            coreConfig.systemEvents.priorityChanged,
            () => {
                self._sortAll();
            }
        );
    }
    /**
     * Sorting all systems and all systems of all groups.
     */
    _sortAll() {
        this.sortSystemsByPriority(this.systems);
        for (let systemsOfGroup of this.systemGroups.values()) {
            this.sortSystemsByPriority(systemsOfGroup);
        }
    }
    /**
     * Update only these systems
     * @param systems systems for update
     * @param deltaTime delta time
     */
    _updateSystems(systems: System[], deltaTime: number) {
        for (let system of systems) {
            system.update(deltaTime);
        }
    }
    /**
     * Update only these groups.
     * @param groups groups for update
     * @param deltaTime delta time
     */
    updateSystemsOfTheseGroups(groups: string[], deltaTime: number) {
        let systemsSet = new Set<System>();
        for (let groupName of groups) {
            this.systemGroups.get(groupName).map(x => systemsSet.add(x));
        }
        let systemsArray = [...systemsSet];
        this.sortSystemsByPriority(systemsArray);
        this._updateSystems(systemsArray, deltaTime);
    }
    /**
     * Sorting systems by priority
     * @param systems systems for sorting
     */
    sortSystemsByPriority(systems: System[]) {
        systems.sort((s1, s2) => {
            return s2.getPriority() - s1.getPriority()
        });
    }
    /**
     * Update engine - all systems.
     * @param deltaTime delta time
     */
    update(deltaTime: number = 0) {
        this._updateSystems(this.systems, deltaTime);
    }
    toString() {
        let data: SaveData = {
            entities: [],
        };
        for (let [entityId, componentsMap] of this.entities) {
            let componentsData: ComponentsSaveData = {};
            for (let [ClassName, components] of componentsMap) {
                for (let component of components) {
                    if (!componentsData[ClassName]) {
                        componentsData[ClassName] = [];
                    }
                    componentsData[ClassName].push(component);
                }
            }
            data.entities.push({
                entityId,
                components: JSON.parse(JSON.stringify(componentsData))
            });
        }
        return JSON.stringify(data);
    }
    fromString(dataString: string, context: any) {
        let data = JSON.parse(dataString) as SaveData;
        for (let entityData of data.entities) {
            this.createEmptyEntity(entityData.entityId);
            for (let ClassName in entityData.components) {
                for (let componentData of entityData.components[ClassName]) {
                    let component = new context[ClassName]();
                    Object.assign(component, componentData);
                    this.addComponentToEntity(entityData.entityId, component);
                }
            }
        }
    }
}
