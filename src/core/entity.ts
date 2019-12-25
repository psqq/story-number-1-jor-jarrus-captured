import Component from "./component";
import Engine from "./engine";
import coreConfig from "./core-config";
import { ComponentAddedToEntityEvent } from "./events";

export default class Entity {
    private components: Component[];
    private id: number;
    private engine: Engine;
    private listeners: { [key: string]: (...args: any[]) => any };
    constructor(id: number, engine: Engine, components: Component[]) {
        this.components = components;
        this.id = id;
        this.engine = engine;
        let self = this;
        this.listeners = {
            [coreConfig.engineEvents.componentAddedToEntity]:
                (event: ComponentAddedToEntityEvent) => {
                    if (event.entityId == self.id) {
                        self.components.push(event.component);
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
    }
    addComponent(component: Component) {
        this.components.push(component);
    }
    getId(): number {
        return this.id;
    }
    get<T>(ComponentClass: new (...arg: any) => T): T {
        for (let component of this.components) {
            if (component instanceof ComponentClass) {
                return component;
            }
        }
    }
    gets<T>(ComponentClass: new (...arg: any) => T): T[] {
        let components: T[] = [];
        for (let component of this.components) {
            if (component instanceof ComponentClass) {
                components.push(component);
            }
        }
        return components;
    }
}
