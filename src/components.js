import * as ecs from "./ecs";

export class AutoAttack extends ecs.Component {
    constructor() {
        super();
        this.targetId = 0;
    }
}

export class Characteristics extends ecs.Component {
    constructor() {
        super();
        const statOptions = {
            current: 0,
            base: 0,
            bonus: 0,
            total: 0,
            perLevel: 0,
        };
        this.healthPoints = Object.assign({}, statOptions);
        this.magicPoints = Object.assign({}, statOptions);
        this.physicalDamage = Object.assign({}, statOptions);
        this.magicDamage = Object.assign({}, statOptions);
        this.physicalArmor = Object.assign({}, statOptions);
        this.magicArmor = Object.assign({}, statOptions);
        this.criticalChance = Object.assign({}, statOptions);
    }
}

export class Damage extends ecs.Component {
    constructor() {
        super();
        this.sourceId = 0;
        this.targetId = 0;
        this.physicalDamage = 0;
        this.magicDamage = 0;
        this.trueDamage = 0;
    }
}

export class Deep extends ecs.Component {
    constructor() {
        super();
        /** @type {number} */
        this.deep = null;
    }
}

export class DepthMoving extends ecs.Component {
    constructor() {
        super();
        /** @type {number} */
        this.toDeep = null;
    }
}

export class Dungeon extends ecs.Component {
    constructor() {
        super();
        /** @type {string[][]} */
        this.map = null;
    }
}

export class ExperienceLevel extends ecs.Component {
    constructor() {
        super();
        this.level = 0;
        this.currentExperience = 0;
        this.currentLevelExperience = 0;
        this.nextLevelExperience = 0;
    }
}

export class Fov extends ecs.Component {
    constructor() {
        super();
        /** @type {boolean[][]} */
        this.fov = null;
    }
}

export class Glyph extends ecs.Component {
    constructor() {
        super();
        this.symbol = '';
        this.fgColor = '';
        this.bgColor = '';
        this.zLevel = 0;
    }
}

export class HealthPoints extends ecs.Component {
    constructor() {
        super();
        this.currentHealthPoints = 0;
        this.baseHealthPoints = 0;
        this.bonusHealthPoints = 0;
        this.totalHealthPoints = 0;
        this.healthPointsPerLevel = 0;
    }
}

export class HeroQSkill extends ecs.Component {
    constructor() {
        super();
        this.level = 0;
        this.duration = 0;
        this.damage = 0;
        this.damageReduction = 0;
        this.coolDown = 0;
    }
}

export class MemorizedFovArea extends ecs.Component {
    constructor() {
        super();
        /** @type {boolean[][]} */
        this.memorizedFovArea = null;
        this.deep = 0;
    }
}

export class MoveDirection extends ecs.Component {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
    isNeedUpdate() {
        return this.isInitialized();
    }
}

export class Obstacle extends ecs.Component {
    constructor() {
        super();
    }
}

export class Player extends ecs.Component {
    constructor() {
        super();
    }
}

export class Position extends ecs.Component {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
}

export class Shield extends ecs.Component {
    constructor() {
        super();
        this.shield = 0;
    }
}

export class HeroPassive extends ecs.Component {
    constructor() {
        super();
        this.shieldForKill = 0;
        this.shield = 0;
        this.pDmgForKill = 0;
        this.pDmg = 0;
        this.duration = 0;
    }
}

export class SimpleAi extends ecs.Component {
    constructor() {
        super();
        /** @type {{x:number, y:number}} */
        this.target = { x: null, y: null };
    }
}

export class Stairs extends ecs.Component {
    constructor() {
        super();
        this.toDeep = 0;
    }
}

export class Enemy extends ecs.Component {
    constructor() {
        super();
    }
}

export class Type extends ecs.Component {
    constructor() {
        super();
        this.typeName = '';
    }
}
