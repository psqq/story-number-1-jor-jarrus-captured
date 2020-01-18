import { make } from "./tools";

export class Engine {
    /**
     * @param {Object} options
     * @param {number} options.fixedDeltaTime
     */
    constructor(options) {
        /** @type {System[]} */
        this.systems = [];
        /** @type {Map<number, Entity>} */
        this.entities = new Map();
        this._uid = 0;
        this.registeredComponents = {};
    }
    toString() {
        let data = {};
        data._uid = this._uid;
        data.entities = {};
        for (let e of this.entities.values()) {
            data.entities[e.id] = e.toString();
        }
        return JSON.stringify(data);
    }
    fromString(s) {
        let data = JSON.parse(s);
        this._uid = data._uid;
        this.clearEntities();
        for (let entityId in data.entities) {
            this.entities.set(
                entityId,
                make(Entity, e => {
                    e.fromString(
                        data.entities[entityId],
                        this.registeredComponents
                    );
                })
            );
        }
    }
    /**
     * @param {(new (...arg: any) => Component)[]} ComponentClasses
     */
    registerComponentClasses(ComponentClasses) {
        for (let ComponentClass of ComponentClasses) {
            const name = ComponentClass.name;
            this.registeredComponents[name] = ComponentClass;
        }
    }
    clearEntities() {
        this.entities = new Map();
    }
    /**
     * @param {Component[]} components
     */
    createEntity(...components) {
        let id = this._uid++;
        let entity = new Entity(id, components);
        this.entities.set(id, entity);
        return entity;
    }
    /**
     * @param {Entity} entity
     */
    removeEntity(entity) {
        this.entities.delete(entity.id);
    }
    /**
     * @param {(new (...arg: any) => Component)[]} ComponentClasses
     * @returns {Entity[]}
     */
    getEntities(...ComponentClasses) {
        const entities = [...this.entities.values()];
        return entities.filter(e => e.has(...ComponentClasses));
    }
    /**
     * @param {(new (...arg: any) => Component)[]} ComponentClasses
     * @returns {Entity[]}
     */
    getPartEntities(entities, ComponentClasses) {
        return entities.filter(e => e.has(...ComponentClasses));
    }
    getAllEntities() {
        return [...this.entities.values()];
    }
    getAllSystems() {
        return this.systems;
    }
    /**
     * @type {System} system
     */
    addSystem(system) {
        system.setEngine(this);
        this.systems.push(system);
    }
    isNeedUpdate() {
        for (let e of this.entities.values()) {
            if (e.isNeedUpdate()) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {System[]} systems
     * @param {Entity[]} entities
     * @param {number} deltaTime
     */
    update(systems, entities, deltaTime) {
        if (!systems || systems.length == 0 || !entities || entities.length == 0) {
            return;
        }
        for (let system of systems) {
            system.update(entities, deltaTime);
        }
    }
}

export class Entity {
    /**
     * @param {number} id
     * @param {Component[]} components
     */
    constructor(id, components) {
        this.id = id;
        this.components = components || [];
    }
    toString() {
        let data = {};
        data.id = this.id;
        data.components = [];
        for (let c of this.components) {
            data.components.push({
                ComponentClass: c.constructor.name,
                component: c,
            });
        }
        return JSON.stringify(data);
    }
    fromString(s, ComponentClasses) {
        let data = JSON.parse(s);
        this.id = data.id;
        this.components = [];
        for (let c of data.components) {
            let obj = new ComponentClasses[c.ComponentClass]();
            Object.assign(obj, c.component);
            this.components.push(obj);
        }
    }
    isNeedUpdate() {
        return this.components.some(c => c.isNeedUpdate());
    }
    /**
     * @param {new (...arg: any) => Component} ComponentClass
     */
    _hasOne(ComponentClass) {
        return !!this.get(ComponentClass);
    }
    /**
     * @param {new (...arg: any) => T} ComponentClass
     * @returns {T[]}
     * @template T
     */
    gets(ComponentClass) {
        return this.components.filter(c => c instanceof ComponentClass);
    }
    /**
     * @param {new (...arg: any) => T} ComponentClass
     * @returns {T}
     * @template T
     */
    get(ComponentClass) {
        return this.gets(ComponentClass)[0];
    }
    /**
     * @param {(new (...arg: any) => Component)[]} ComponentClasses
     */
    has(...ComponentClasses) {
        return ComponentClasses.every(ComponentClass => this._hasOne(ComponentClass));
    }
}

export class Component {
    erase() {
        Object.keys(this).forEach(key => this[key] = null);
    }
    isInitialized() {
        return Object.keys(this).some(key => this[key] != null);
    }
    isNeedUpdate() {
        return false;
    }
    repr() {
        let s = this.constructor.name + "(";
        for (let key in this) {
            if (s[s.length - 1] != '(') {
                s += ', ';
            }
            let value = JSON.stringify(this[key]);
            s += `${key}=${value}`;
        }
        return s + ")";
    }
}

export class System {
    constructor() {
        /** @type {Engine} */
        this.engine = null;
    }
    setEngine(engine) {
        this.engine = engine;
    }
    /**
     * @param {Entity[]} entities
     * @param {number} deltaTime
     */
    update(entities, deltaTime) { }
}
