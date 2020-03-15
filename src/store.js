import config from './config.js';
import id from './id.js';

function getInitialState() {
  return {
    player: {
      x: 3, y: 15,
      hp: 550,
      ad: 75,
    },
    currentEnemy: null,
    enemies: [
      {
        id: id(),
        x: 0, y: 0,
        ch: 'g',
        hp: 400,
        ad: 45,
      },
    ]
  };
}

export default new Vuex.Store({
  state: {
    screen: 'mainmenu',
    defaultSize: config.defaultSize,
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
    movePlayer(state, dir) {
      state.player.x += dir.x;
      state.player.y += dir.y;
    },
    tryAddRandomEnemy(state) {
      const x = Math.floor(Math.random() * state.defaultSize.width);
      const y = Math.floor(Math.random() * state.defaultSize.height);
      if (this.getters.isMovablePosition({ x, y })) {
        state.enemies.push({
          id: id(),
          x, y,
          ch: 'g',
          hp: 300 + Math.floor(Math.random() * 200),
          ad: 25 + Math.floor(Math.random() * 50),
        });
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
      defender.hp -= attacker.ad;
      if (defender.hp <= 0) {
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
  }
});
