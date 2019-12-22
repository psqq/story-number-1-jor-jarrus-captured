import Component from "./component";

export default class Entity {
    private components: Component[];
    private id: number;
    constructor(id: number, components: Component[]) {
        this.components = components;
        this.id = id;
    }
    addComponent(component: Component) {
        this.components.push(component);
    }
    getId(): number {
        return this.id;
    }
    get<T>(ComponentClass: new (...arg: any) => T): T {
        for(let component of this.components) {
            if (component instanceof ComponentClass) {
                return component;
            }
        }
    }
    gets<T>(ComponentClass: new (...arg: any) => T): T[] {
        let components: T[] = [];
        for(let component of this.components) {
            if (component instanceof ComponentClass) {
                components.push(component);
            }
        }
        return components;
    }
}
