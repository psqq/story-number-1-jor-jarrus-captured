import store from './store.js';
import GameDisplay from './game-display.js';

new Vue({
  store,
  methods: {
    ...Vuex.mapMutations(['startNewGame', 'openMainMenu']),
  },
  computed: {
    ...Vuex.mapState(['screen']),
  },
  components: {
    GameDisplay
  },
}).$mount("#root")
