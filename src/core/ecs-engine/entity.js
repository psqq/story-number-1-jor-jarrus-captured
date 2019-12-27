import Component from "./component";
import Engine from "./engine";

export default class Entity {
    /**
     * @param {number} id
     * @param {Map<string, Component[]>} components
     * @param {Engine} engine
     */
    constructor(id, components, engine) {
        this.id = id;
        this.components = components;
        this.engine = engine;
    }
    /**
     * Destructor
     */
    erase() {}
    getId() {
        return this.id;
    }
    /**
     * @param {new (...arg: any) => T} ComponentClass 
     * @returns {T}
     * @template T
     */
    get(ComponentClass) {
        const nameOfComponentClass = this.engine.getNameOfComponentClass(ComponentClass);
        if (!this.components.has(nameOfComponentClass)) {
            throw "Component not found in entity: " + nameOfComponentClass;
        }
        const componentsOfThisComponentClass = this.components.get(nameOfComponentClass);
        if (componentsOfThisComponentClass.length == 0) {
            throw "Component not found in entity: " + nameOfComponentClass;
        }
        return componentsOfThisComponentClass[0];
    }
    /**
     * @param {new (...arg: any) => T} ComponentClass 
     * @returns {T[]}
     * @template T
     */
    gets(ComponentClass) {
        const nameOfComponentClass = this.engine.getNameOfComponentClass(ComponentClass);
        if (!this.components.has(nameOfComponentClass)) {
            throw "Component not found in entity: " + nameOfComponentClass;
        }
        const componentsOfThisComponentClass = this.components.get(nameOfComponentClass);
        if (componentsOfThisComponentClass.length == 0) {
            throw "Component not found in entity: " + nameOfComponentClass;
        }
        return componentsOfThisComponentClass;
    }
}
