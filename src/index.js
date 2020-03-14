
const store = new Vuex.Store({
  state: {
    screen: 'mainmenu',
  },
  mutations: {
    startNewGame(state) {
      state.screen = 'game';
    }
  }
});

new Vue({
  store,
  methods: {
    ...Vuex.mapMutations(['startNewGame']),
  },
  computed: {
    ...Vuex.mapState(['screen']),
  },
}).$mount("#root")
