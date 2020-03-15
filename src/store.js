import config from './config.js';

export default new Vuex.Store({
  state: {
    screen: 'mainmenu',
    defaultSize: config.defaultSize,
    player: {
      x: 3, y: 15,
      hp: 550,
      ad: 75,
    },
    enemies: [
      {
        x: 0, y: 0,
        ch: 'g',
        hp: 400,
        ad: 45,
      },
    ]
  },
  mutations: {
    startNewGame(state) {
      state.screen = 'game';
    },
    openMainMenu(state) {
      state.screen = 'mainmenu';
    },
    movePlayer(state, dir) {
      state.player.x += dir.x;
      state.player.y += dir.y;
    },
  },
  getters: {
    isMovablePosition(state) {
      return (pos) => {
        return pos.x >= 0 && pos.x < state.defaultSize.width
          && pos.y >= 0 && pos.y < state.defaultSize.height
          && !state.enemies.some(e => e.x == pos.x && e.y == pos.y);
      };
    },
    playerPosition(state) {
      return new Victor(state.player.x, state.player.y);
    },
    getCurrentEnemy(state) {
      return state.enemies[0];
    },
  }
});
