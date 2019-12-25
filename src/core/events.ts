import Component from "./component";

export interface ComponentAddedToEntityEvent {
    entityId: number,
    component: Component,
}
