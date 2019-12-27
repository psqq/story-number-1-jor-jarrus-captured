
const coreConfig = {
    systemEvents: {
        priorityChanged: 'priority-changed',
    },
    engineEvents: {
        entityCreated: 'entity-created',
        entityRemoved: 'enitty-removed',
        componentAddedToEntity: 'componentAddedToEntity',
    },
    smartEntitiesContainerEvents: {
        changed: 'changed',
    },
};

export default coreConfig;
