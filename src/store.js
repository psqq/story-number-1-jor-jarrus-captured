import config from './config.js';

export default new Vuex.Store({
  state: {
    screen: 'mainmenu',
    defaultSize: config.defaultSize,
    playerPosition: {
      x: 3, y: 15,
    },
  },
  mutations: {
    startNewGame(state) {
      state.screen = 'game';
    },
    openMainMenu(state) {
      state.screen = 'mainmenu';
    },
    movePlayer(state, dir) {
      state.playerPosition.x += dir.x;
      state.playerPosition.y += dir.y;
    },
  }
});
