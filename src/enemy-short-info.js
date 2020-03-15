
export default {
  name: 'enemy-short-info',
  template: '#enemy-short-info',
  computed: {
    ...Vuex.mapGetters({
      enemy: 'getCurrentEnemy',
    }),
  },
}
