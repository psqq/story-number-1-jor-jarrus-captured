<template>
  <div class="game-display">
    <img v-show="false" id="dcss-tiles" src="../assets/DungeonCrawl_ProjectUtumnoTileset.png" />
  </div>
</template>

<script>
import Vuex from "vuex";
import * as ROT from "rot-js";

import config from "../config.js";

const display = new ROT.Display({
  width: config.defaultSize.width,
  height: config.defaultSize.height,
  fontSize: 14,
  forceSquareRatio: true,
  layout: "tile",
  bg: "transparent",
  tileWidth: 32,
  tileHeight: 32,
  tileMap: {
    "@": [4 * 32, 2 * 32],
    g: [3 * 32, 2 * 32],
    ".": [7 * 32, 15 * 32]
  }
});

export default {
  name: "game-display",
  template: "#game-display",
  methods: {
    ...Vuex.mapMutations([
      "movePlayer",
      "attack",
      "tryAddRandomEnemy",
      "turnAi",
      "openLoseScreen"
    ]),
    draw(what) {
      const p = this.playerPosition;
      display.clear();
      if (!what || what == "floor") {
        for (let y = 0; y < this.defaultSize.height; y++) {
          for (let x = 0; x < this.defaultSize.width; x++) {
            display.draw(x, y, ".");
          }
        }
      }
      if (!what || what == "beings") {
        display.draw(p.x, p.y, "@");
        for (let e of this.enemies) {
          display.draw(e.x, e.y, e.ch);
        }
      }
    },
    handleKeyboardEvnets(e) {
      let dir = config.directionByKeyCode[e.code];
      if (dir) {
        if (dir.isZero()) {
          this.update();
        } else {
          let newPos = dir.clone().add(this.playerPosition);
          let enemy = this.getEnemyInThisPosition(newPos);
          if (enemy) {
            this.attack({ defenderId: enemy.id });
            this.update();
          } else if (this.isMovablePosition(newPos)) {
            this.movePlayer(dir);
            this.update();
          }
        }
      }
    },
    update() {
      if (Math.random() < 0.1) {
        this.tryAddRandomEnemy();
      }
      this.turnAi();
      if (!this.isPlayerAlive) {
        this.openLoseScreen();
      }
      this.$forceUpdate();
    }
  },
  computed: {
    ...Vuex.mapState(["enemies", "defaultSize"]),
    ...Vuex.mapGetters([
      "playerPosition",
      "isMovablePosition",
      "getEnemyInThisPosition",
      "isPlayerAlive"
    ])
  },
  mounted() {
    this.$el.appendChild(display.getContainer());
    /** @type {HTMLImageElement} */
    var tileSet = document.querySelector("#dcss-tiles");
    display.setOptions({
      tileSet: tileSet
    });
    tileSet.onload = () => {
      this.draw("floor");
      setTimeout(() => {
        this.draw("beings");
      }, 100);
    };
    this.draw();
    document.addEventListener("keydown", this.handleKeyboardEvnets);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeyboardEvnets);
  },
  updated() {
    this.draw();
  }
};
</script>
