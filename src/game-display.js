import config from './config.js';

const display = new ROT.Display({
  width: config.defaultSize.width,
  height: config.defaultSize.height,
  fontSize: 16,
  forceSquareRatio: true,
});

export default {
  name: 'game-display',
  template: '#game-display',
  methods: {
    ...Vuex.mapMutations(['movePlayer']),
    draw() {
      const p = this.playerPosition;
      display.clear();
      display.draw(p.x, p.y, '@', 'white', 'black');
    },
    handleKeyboardEvnets(e) {
      let dir = config.directionByKeyCode[e.code];
      if (dir) {
        this.movePlayer(dir);
        this.$forceUpdate();
      }
    },
  },
  computed: {
    ...Vuex.mapState(['playerPosition']),
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
