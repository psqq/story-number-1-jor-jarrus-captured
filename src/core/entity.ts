import Component from "./component";
import Engine from "./engine";
import coreConfig from "./core-config";
import { ComponentAddedToEntityEvent } from "../game/systems/events";

export default class Entity {
    private components: Component[];
    private id: number;
    private engine: Engine;
    constructor(id: number, engine: Engine, components: Component[]) {
        this.components = components;
        this.id = id;
        this.engine = engine;
        this.engine.on(
            coreConfig.engineEvents.componentAddedToEntity,
            (event: ComponentAddedToEntityEvent) => {
                if (event.entityId == this.id) {
                    this.components.push(event.component);
                }
            }
        );
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
