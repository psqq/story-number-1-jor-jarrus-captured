import Vuex from 'vuex';
import Vue from 'vue';
import Victor from 'victor';

import config from '../config.js';
import id from '../id.js';
import items from '../items.js';
import * as skills from '../skills.js';


Vue.use(Vuex);


function makeBeing(options) {
  const defaultOptions = {
    x: 0, y: 0,
    hp: 500, maxHp: 500,
    ad: 50,
    bonusAd: 0,
    gold: 0,
    ch: '?',
    inventory: [],
    skills: [],
  };
  return Object.assign(Object.assign({}, defaultOptions), options);
}

function makeRandomGoblin(x, y) {
  const hp = 300 + Math.floor(Math.random() * 200);
  return makeBeing({
    id: id(),
    x, y,
    ch: 'g',
    hp, maxHp: hp,
    ad: 25 + Math.floor(Math.random() * 50),
    bonusAd: 0,
  });
}


function getInitialState() {
  return {
    player: makeBeing({
      x: 15, y: 15,
      hp: 550, maxHp: 550,
      ad: 75,
      bonusAd: 0,
      gold: 500,
      inventory: [],
      skills: [
        skills.findSkillById('passive-mc-skill'),
      ],
    }),
    currentEnemy: null,
    enemies: [
      makeBeing({
        id: id(),
        x: 10, y: 10,
        ch: 'g',
        hp: 400, maxHp: 400,
        ad: 45,
        bonusAd: 0,
      }),
    ]
  };
}

export default new Vuex.Store({
  state: {
    screen: 'mainmenu',
    defaultSize: config.defaultSize,
    items,
    ...getInitialState(),
  },
  mutations: {
    startNewGame(state) {
      state.screen = 'game';
      Object.assign(state, getInitialState());
    },
    openMainMenu(state) {
      state.screen = 'mainmenu';
    },
    openLoseScreen(state) {
      state.screen = 'lose';
    },
    openGameScreen(state) {
      state.screen = 'game';
    },
    openShopScreen(state) {
      state.screen = 'shop';
    },
    movePlayer(state, dir) {
      state.player.x += dir.x;
      state.player.y += dir.y;
    },
    buyItem(state, { itemId }) {
      let item = state.items.find(item => item.id == itemId);
      state.player.gold -= item.cost;
      state.player.inventory.push(itemId);
      this.commit('applyInventory');
    },
    onKill(state, { killer }) {
      for (let skill of killer.skills) {
        if (skill.trigger == 'kill-enemy') {
          if (skill.effect == 'health-10-percent-of-max-hp') {
            killer.hp = Math.min(killer.maxHp, killer.hp + 0.1 * killer.maxHp);
          }
        }
      }
    },
    applyInventory(state) {
      const p = state.player;
      p.bonusAd = 0;
      for (let itemId of p.inventory) {
        let item = state.items.find(item => item.id == itemId);
        for (let passiveEffect of item.passives) {
          if (passiveEffect.name == 'flat-bonus-ad') {
            p.bonusAd += passiveEffect.value;
          }
        }
      }
    },
    tryAddRandomEnemy(state) {
      const x = Math.floor(Math.random() * state.defaultSize.width);
      const y = Math.floor(Math.random() * state.defaultSize.height);
      if (this.getters.isMovablePosition({ x, y })) {
        const goblin = makeRandomGoblin(x, y);
        state.enemies.push(goblin);
      }
    },
    attack(state, { attackerId, defenderId }) {
      let attacker = attackerId && state.enemies.find(e => e.id == attackerId) || state.player;
      let defender = defenderId && state.enemies.find(e => e.id == defenderId) || state.player;
      if (!defender) {
        return;
      }
      if (defender.id) {
        state.currentEnemy = defender;
      }
      defender.hp -= attacker.ad + attacker.bonusAd;
      if (defender.hp <= 0) {
        this.commit('onKill', { dead: defender, killer: attacker });
        state.enemies = state.enemies.filter(e => e.hp > 0);
        if (defender.id) {
          state.currentEnemy = null;
        }
      }
    },
    turnAi(state) {
      let p = state.player;
      for (let e of state.enemies) {
        if (Math.max(Math.abs(p.x - e.x), Math.abs(p.y - e.y)) <= 1) {
          this.commit('attack', { attackerId: e.id });
        } else if (Math.random() < 0.8) {
          let dir = new Victor(
            [1, -1][Math.floor(Math.random() * 2)],
            [1, -1][Math.floor(Math.random() * 2)],
          );
          let newPos = dir.clone().add(e);
          if (this.getters.isMovablePosition(newPos)) {
            e.x += dir.x;
            e.y += dir.y;
          }
        }
      }
    }
  },
  getters: {
    isMovablePosition(state) {
      return (pos) => {
        return pos.x >= 0 && pos.x < state.defaultSize.width
          && pos.y >= 0 && pos.y < state.defaultSize.height
          && !state.enemies.some(e => e.x == pos.x && e.y == pos.y)
          && !(pos.x == state.player.x && pos.y == state.player.y);
      };
    },
    getEnemyInThisPosition(state) {
      return (pos) => {
        return state.enemies.find(e => e.x == pos.x && e.y == pos.y);
      };
    },
    playerPosition(state) {
      return new Victor(state.player.x, state.player.y);
    },
    isPlayerAlive(state) {
      return state.player.hp > 0;
    },
    getCurrentEnemy(state) {
      return state.currentEnemy;
    },
    getItemNameById(state) {
      return (itemId) => {
        let item = state.items.find(item => item.id == itemId);
        return item && item.name;
      };
    }
  }
});
