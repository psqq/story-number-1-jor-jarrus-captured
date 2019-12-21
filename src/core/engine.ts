import System from "./system";
import EventEmmiter from "wolfy87-eventemitter";
import config from "../config";
import Component from "./component";
import getuid from "./getuid";
import Entity from "./entity";
import coreConfig from "./core-config";

type EntityId = number;
type SystemGroups = Map<string, System[]>;
type Entities = Map<EntityId, Map<string, Component>>;
type Components = Map<string, Set<number>>;
type Class<T> = new () => T;

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
    /**
     * Adding component to entity
     * @param entity entity for adding component
     * @param component component for adding
     */
    addComponentToEntity(entity: EntityId, component: Component) {
        let ComponentClass = component.constructor;
        if (!this.components.has(ComponentClass.name)) {
            this.components.set(ComponentClass.name, new Set());
        }
        this.components.get(ComponentClass.name).add(entity);
        if (!this.entities.has(entity)) {
            this.entities.set(entity, new Map());
        }
        this.entities.get(entity).set(ComponentClass.name, component);
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
        this.emit(coreConfig.engineEvents.entityCreated, new Entity(entityId, components));
        return entityId;
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
                let components = [];
                for (let ComponentClass of ComponentClasses) {
                    components.push(this.entities.get(entity).get(ComponentClass.name));
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
        for(let [entityId, components] of this._getComponents(...ComponentClasses)) {
            let entity = new Entity(entityId, components);
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
        system.on(coreConfig.systemEvents.priorityChanged, () => {
            this._sortAll();
        });
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
}
