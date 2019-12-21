import Engine from "./engine";
import System from "./system";

export default class EngineBuilder {
    private engine: Engine;
    private system: System;
    private groups: Set<string>;
    private priorityForNextSystem: number = 0;
    private prority: number = 0;
    constructor(engine?: Engine) {
        this.engine = engine || new Engine();
        this.system = null;
        this.groups = null;
        this.prority = null;
    }
    _clearCurrentSystemSettings() {
        this.system = null;
        this.groups = null;
        this.prority = null;
    }
    _addCurrentSystemIfNeed() {
        if (!this.system) {
            return;
        }
        if (!this.prority) {
            this.prority = this.priorityForNextSystem;
        }
        this.priorityForNextSystem -= 1;
        this.system.setPriority(this.prority);
        this.engine.addSystem(this.system);
        for(let groupName of this.groups) {
            this.engine._addSystemToGroup(this.system, groupName);
        }
    }
    addSystem(system: System) {
        this._addCurrentSystemIfNeed();
        this.system = system;
        this.groups = new Set();
        return this;
    }
    withPriority(priority: number) {
        this.system.setPriority(priority);
        return this;
    }
    withOnlyTheseGroups(groupNames: string[]) {
        this.groups = new Set(groupNames);
        return this;
    }
    withOnlyThisGroup(groupName: string) {
        this.groups = new Set([groupName]);
        return this;
    }
    withGroup(groupName: string) {
        this.groups.add(groupName);
        return this;
    }
    getEngine() {
        this._addCurrentSystemIfNeed();
        const engine = this.engine;
        this.engine = null;
        return engine;
    }
}
