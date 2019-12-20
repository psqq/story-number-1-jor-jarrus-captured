import System from "./system"

interface SystemGroups {
    string: System[]
};

export default class Engine {
    systems: System[];
    systemGroups: SystemGroups;
    priorityForNextSystem: number;
    /**
     * Constructor
     */
    constructor() {
        this.systems = [];
        this.priorityForNextSystem = 0;
    }
    /**
     * Adding Systems to the Engine
     * @param system system for add
     * @param priority priority
     * @param groupName Name of the group the system will be in
     */
    addSystem(system: System, priority: number = null, groupName: string = '') {
        if (priority === null) {
            priority = this.priorityForNextSystem--;
        }
        this.systems.push(system.setPriority(priority));
        this.sortSystemsByPriority(this.systems);
        if (this.systemGroups[groupName]) {
            this.systemGroups[groupName] = [];
        }
        this.systemGroups[groupName].push(system);
        this.sortSystemsByPriority(this.systemGroups[groupName]);
    }
    /**
     * Sorting systems by priority
     * @param systems systems for sorting
     */
    sortSystemsByPriority(systems: System[]) {
        systems.sort((s1, s2) => {
            return s2.getPriority() - s1.getPriority()
        });
    }
    update(deltaTime: number) {
        for(let system of this.systems) {
            system.update(deltaTime);
        }
    }
}
