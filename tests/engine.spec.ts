import { expect } from 'chai';
import Engine from '../src/core/engine';
import System from '../src/core/system';

class TimeSystem extends System {
    time: number;
    constructor() {
        super();
        this.time = 0;
    }
    update(deltaTime: number) {
        this.time += deltaTime;
    }
}

function makeSystems(n: number) {
    const systems = [];
    for(let i=0; i<n; i++) {
        systems.push(new TimeSystem());
    }
    return systems;
}

describe('Engine.update', () => {
    it('should update system', () => {
        const engine = new Engine();
        const system = new TimeSystem();
        engine.addSystem(system);
        engine.update(1);
        expect(system.time).to.equal(1);
        engine.update(1);
        expect(system.time).to.equal(2);
    });
});

describe('Engine.updateSystemsOfTheseGroups', () => {
    it('should update systems group', () => {
        const engine = new Engine();
        const [s1, s2, s3, s4] = makeSystems(4);
        engine.addSystem(s1, 1, 'group1');
        engine.addSystem(s2, 2, 'group1');
        engine.addSystem(s3);
        engine.addSystem(s4);
        engine.updateSystemsOfTheseGroups(['group1'], 1);
        expect(s1.time).to.equal(1);
        expect(s2.time).to.equal(1);
        expect(s3.time).to.equal(0);
        expect(s4.time).to.equal(0);
        engine.update(1);
        expect(s1.time).to.equal(2);
        expect(s2.time).to.equal(2);
        expect(s3.time).to.equal(1);
        expect(s4.time).to.equal(1);
    });
});
