import * as c from "./components";
import * as ecs from "./ecs";
import BaseSystem from "./base-system";

export class DisplayGlyph extends BaseSystem {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
    }
    /**
     * @param {ecs.Entity[]} entities
     * @param {number} deltaTime
     */
    update(entities, deltaTime) {
        const glyphEntities = this.engine.getPartEntities(
            entities,
            [c.Position, c.Glyph]
        );
        glyphEntities.sort((a, b) => {
            return b.get(c.Glyph).zLevel - a.get(c.Glyph).zLevel;
        });
        for (let e of glyphEntities) {
            this.drawGlyph(e);
        }
    }
}

export class Moving extends BaseSystem {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
    }
    /**
     * @param {ecs.Entity[]} entities
     * @param {number} deltaTime
     */
    update(entities, deltaTime) {
        const moveableEntities = this.engine.getPartEntities(
            entities,
            [c.Position, c.MoveDirection]
        );
        for (let e of moveableEntities) {
            if (this.canMove(e)) {
                if (this.tryMove(e, deltaTime)) {
                    e.get(c.MoveDirection).erase();
                }
            } else {
                e.get(c.MoveDirection).erase();
            }
        }
    }
}

export class Stats extends BaseSystem {
    /**
     * @param {App} app 
     */
    constructor(app) {
        super(app);
    }
    /**
     * @param {ecs.Entity[]} entities
     * @param {number} deltaTime
     */
    update(entities, deltaTime) {
        const moveableEntities = this.engine.getPartEntities(
            entities,
            [c.Stats],
        );
        for (let e of moveableEntities) {
            const stats = e.get(c.Stats);
            this.updateBonusStats(e);
            for (let stat in stats) {
                stats[stat].total = stats[stat].base + stats[stat].bonus;
            }
        }
    }
}
