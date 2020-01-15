import Component from "./core/ecs-engine/component";

export class AutoAttack extends Component {
    constructor() {
        this.targetId = 0;
    }
}

export class Characteristics extends Component {
    constructor() {
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

export class Damage extends Component {
    constructor() {
        this.sourceId = 0;
        this.targetId = 0;
        this.physicalDamage = 0;
        this.magicDamage = 0;
        this.trueDamage = 0;
    }
}

export class Deep extends Component {
    constructor() {
        /** @type {number} */
        this.deep = null;
    }
}

export class DepthMoving extends Component {
    constructor() {
        /** @type {number} */
        this.toDeep = null;
    }
}

export class Dungeon extends Component {
    constructor() {
        /** @type {string[][]} */
        this.map = null;
    }
}

export class ExperienceLevel extends Component {
    constructor() {
        this.level = 0;
        this.currentExperience = 0;
        this.currentLevelExperience = 0;
        this.nextLevelExperience = 0;
    }
}

export class Fov extends Component {
    constructor() {
        /** @type {boolean[][]} */
        this.fov = null;
    }
}

export class Glyph extends Component {
    constructor() {
        this.symbol = '';
        this.fgColor = '';
        this.bgColor = '';
        this.zLevel = 0;
    }
}

export class HealthPoints extends Component {
    constructor() {
        this.currentHealthPoints = 0;
        this.baseHealthPoints = 0;
        this.bonusHealthPoints = 0;
        this.totalHealthPoints = 0;
        this.healthPointsPerLevel = 0;
    }
}

export class HeroQSkill extends Component {
    constructor() {
        this.level = 0;
        this.duration = 0;
        this.damage = 0;
        this.damageReduction = 0;
        this.coolDown = 0;
    }
}

export class MemorizedFovAreaComponent extends Component {
    constructor() {
        /** @type {boolean[][]} */
        this.memorizedFovArea = null;
        this.deep = 0;
    }
}

export class MoveDirection extends Component {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

export class Obstacle extends Component {
    constructor() {
    }
}

export class Player extends Component {
    constructor() {
    }
}

export class Position extends Component {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

export class Shield extends Component {
    constructor() {
        this.shield = 0;
    }
}

export class HeroPassive extends Component {
    constructor() {
        this.shieldForKill = 0;
        this.shield = 0;
        this.pDmgForKill = 0;
        this.pDmg = 0;
        this.duration = 0;
    }
}

export class SimpleAi extends Component {
    constructor() {
        /** @type {{x:number, y:number}} */
        this.target = { x: null, y: null };
    }
}

export class Stairs extends Component {
    constructor() {
        this.toDeep = 0;
    }
}

export class Enemy extends Component {
    constructor() {
    }
}

export class Type extends Component {
    constructor() {
        this.typeName = '';
    }
}


