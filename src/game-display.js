import config from './config.js';

const display = new ROT.Display({
  width: config.defaultSize.width,
  height: config.defaultSize.height,
  fontSize: 14,
  forceSquareRatio: true,
});

export default {
  name: 'game-display',
  template: '#game-display',
  methods: {
    ...Vuex.mapMutations([
      'movePlayer',
      'attack',
    ]),
    draw() {
      const p = this.playerPosition;
      display.clear();
      display.draw(p.x, p.y, '@', 'white', 'black');
      for (let e of this.enemies) {
        display.draw(e.x, e.y, e.ch, 'white', 'black');
      }
    },
    handleKeyboardEvnets(e) {
      let dir = config.directionByKeyCode[e.code];
      if (dir) {
        let newPos = dir.clone().add(this.playerPosition);
        let enemy = this.getEnemyInThisPosition(newPos);
        if (enemy) {
          this.attack({ defenderId: enemy.id });
          this.$forceUpdate();
        } else if (this.isMovablePosition(newPos)) {
          this.movePlayer(dir);
          this.$forceUpdate();
        }
      }
    },
  },
  computed: {
    ...Vuex.mapState(['enemies']),
    ...Vuex.mapGetters([
      'playerPosition',
      'isMovablePosition',
      'getEnemyInThisPosition',
    ]),
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
}
