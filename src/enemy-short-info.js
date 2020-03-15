
export default Vue.component('enemy-short-info', {
  name: 'enemy-short-info',
  template: '#enemy-short-info',
  computed: {
    ...Vuex.mapGetters({
      enemy: 'getCurrentEnemy',
    }),
  },
});
