
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
  },
  mutations: {
    startNewGame(state) {
      state.screen = 'game';
    },
    openMainMenu(state) {
      state.screen = 'mainmenu';
    },
  }
});

Vue.component('game-display', {
  template: '#game-display',
  methods: {
    draw() {
      display.draw(1, 1, '@', 'white', 'black');
    }
  },
  mounted() {
    this.$el.appendChild(display.getContainer());
    this.draw();
  },
  updated() {
    this.draw();
  }
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
