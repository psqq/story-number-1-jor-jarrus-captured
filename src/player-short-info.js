
export default {
  name: 'player-short-info',
  template: '#player-short-info',
  computed: {
    ...Vuex.mapState(['player']),
  },
}
