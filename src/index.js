import config from './config.js';

const defaultSize = {
  width: 30,
  height: 30,
};

const display = new ROT.Display({
  width: defaultSize.width,
  height: defaultSize.height,
  fontSize: 16,
  forceSquareRatio: true,
});

const store = new Vuex.Store({
  state: {
    screen: 'mainmenu',
    defaultSize,
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

Vue.component('game-display', {
  template: '#game-display',
  methods: {
    draw() {
      const p = this.playerPosition;
      display.clear();
      display.draw(p.x, p.y, '@', 'white', 'black');
    },
    ...Vuex.mapMutations(['movePlayer']),
    handleKeyboardEvnets(e) {
      let dir = config.directionByKeyCode[e.code];
      if (dir) {
        this.movePlayer(dir);
        this.$forceUpdate();
      }
    },
  },
  mounted() {
    this.$el.appendChild(display.getContainer());
    this.draw();
    document.addEventListener('keydown', this.handleKeyboardEvnets);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyboardEvnets);
  },
  updated() {
    this.draw();
  },
  computed: {
    ...Vuex.mapState(['playerPosition']),
  },
});

new Vue({
  store,
  methods: {
    ...Vuex.mapMutations(['startNewGame', 'openMainMenu']),
  },
  computed: {
    ...Vuex.mapState(['screen']),
  },
}).$mount("#root")
