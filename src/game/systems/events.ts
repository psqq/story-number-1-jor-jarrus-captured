import Component from "../../core/component";

export interface ComponentAddedToEntityEvent {
    entityId: number,
    component: Component,
}
