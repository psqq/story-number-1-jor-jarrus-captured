import { expect } from 'chai';
import Engine from '../src/core/ecs-engine/engine';
import Component from '../src/core/ecs-engine/component';
import System from '../src/core/ecs-engine/system';

class CounterComponent extends Component {
    constructor() {
        super();
        this.counter = null;
    }
    /** @param {CounterComponent} options */
    setup(options) { return super.setup(options); }
}

class CounterSystem extends System {
    constructor() {
        super();
        this.useDeltaTimeForChangeCounter = false;
    }
    /** @param {CounterSystem} options */
    setup(options) { return super.setup(options); }
    /**
     * @param {number} dt 
     */
    update(dt) {
        let entity = this.engine.getEntityWithComponents([CounterComponent]);
        for (let counter of entity.gets(CounterComponent)) {
            if (this.useDeltaTimeForChangeCounter) {
                counter.counter += dt;
            } else {
                counter.counter += 1;
            }
        }
    }
}

describe('Engine', () => {
    it('empty engine', () => {
        const engine = new Engine();
        function check() {
            expect([...engine.entities.keys()].length).eq(0);
            expect(engine.systems.length).eq(0);
            expect([...engine.registeredComponentClasses.keys()].length).eq(0);
        }
        check();
        engine.update(1);
        check();
    });
    it('should throw is not registered', () => {
        const engine = new Engine();
        expect(engine.createEntity.bind(engine, [
            new CounterComponent().setup({
                counter: 1
            })
        ])).to.throw(/is not registered/);
    });
    it('should throw is already registered', () => {
        const engine = new Engine();
        engine.registerComponentClass(CounterComponent);
        expect(
            engine.registerComponentClass.bind(engine, CounterComponent)
        )
            .to.throw(/already/);
    });
    it('Get entity by id', () => {
        const engine = new Engine();
        engine.registerComponentClass(CounterComponent);
        const entityId = engine.createEntity([
            new CounterComponent().setup({
                counter: 1
            })
        ]);
        expect(
            engine.getEntityById(entityId)
                .get(CounterComponent).counter
        ).eq(1);
    });
    it('One CounterComponent', () => {
        const engine = new Engine();
        engine.registerComponentClass(CounterComponent);
        const entityId = engine.createEntity([
            new CounterComponent().setup({
                counter: 1
            })
        ]);
        function check() {
            expect([...engine.entities.keys()].length).eq(1);
            expect(engine.getComponentsOfEntity(entityId, CounterComponent).length).eq(1);
            expect([...engine.registeredComponentClasses.keys()].length).eq(1);
            expect(engine.systems.length).eq(0);
        }
        check();
        engine.update(1);
        check();
    });
    it('Remove entity', () => {
        const engine = new Engine();
        engine.registerComponentClass(CounterComponent);
        const entityId = engine.createEntity([
            new CounterComponent().setup({
                counter: 1
            })
        ]);
        function check() {
            expect([...engine.entities.keys()].length).eq(1);
            expect(engine.getComponentsOfEntity(entityId, CounterComponent).length).eq(1);
            expect(engine.systems.length).eq(0);
        }
        check();
        engine.update(1);
        check();
        engine.removeEntity(entityId);
        expect([...engine.entities.keys()].length).eq(0);
        expect(engine.getComponentsOfEntity.bind(engine, entityId, CounterComponent))
            .to.throw(/No entity/);
        expect(engine.systems.length).eq(0);
    });
    it('Counter system', () => {
        const engine = new Engine();
        engine.registerComponentClass(CounterComponent);
        const entityId = engine.createEntity([
            new CounterComponent().setup({
                counter: 1
            })
        ]);
        const system =
            new CounterSystem()
                .setup({
                    useDeltaTimeForChangeCounter: false,
                });
        engine.addSystem(system);
        expect(engine.addSystem.bind(engine, system)).to.throw(/already/);
        engine.update(1);
        expect(
            engine.getEntityById(entityId)
                .get(CounterComponent).counter
        ).eq(2);
        engine.update(10);
        expect(
            engine.getEntityById(entityId)
                .get(CounterComponent).counter
        ).eq(3);
    });
});
