import store from './store.js';
import GameDisplay from './game-display.js';
import PlayerShortInfo from './player-short-info.js';
import EnemyShortInfo from './enemy-short-info.js';

new Vue({
  store,
  methods: {
    ...Vuex.mapMutations(['startNewGame', 'openMainMenu']),
  },
  computed: {
    ...Vuex.mapState(['screen']),
  },
  components: {
    GameDisplay,
    PlayerShortInfo,
    EnemyShortInfo,
  },
}).$mount("#root")
