import Engine from "./engine";
import coreConfig from "./core-config";
import Entity from "./entity";
import Component from "./component";

type Class = { new(...arg: any): any };

export default class SmartEntitiesContainer {
    private engine: Engine;
    private components: Class[];
    private entities: Entity[];
    constructor(engine: Engine, components: Class[]) {
        this.engine = engine;
        this.components = components;
        this.entities = [];
        this.engine.on(coreConfig.engineEvents.entityCreated, (entity: Entity) => {
            if (this.engine.hasComponents(entity.getId(), this.components)) {
                this.entities.push(entity);
            }
        });
        this.engine.on(coreConfig.engineEvents.entityRemoved, (entity: Entity) => {
            this.entities = this.entities.filter(x => x.getId() != entity.getId());
        });
    }
    getEnties() {
        return this.entities;
    }
}
