
export default Vue.component('player-short-info', {
  name: 'player-short-info',
  template: '#player-short-info',
  computed: {
    ...Vuex.mapState(['player']),
  },
});
