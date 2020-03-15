import store from './store.js';
import './game-display.js';
import './player-short-info.js';
import './enemy-short-info.js';
import './being-base-info.js';

new Vue({
  store,
  methods: {
    ...Vuex.mapMutations(['startNewGame', 'openMainMenu']),
  },
  computed: {
    ...Vuex.mapState(['screen']),
  },
}).$mount("#root")
