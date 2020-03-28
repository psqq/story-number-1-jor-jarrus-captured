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
    ".": [7 * 32, 15 * 32],
    "<": [42 * 32, 15 * 32],
    ">": [41 * 32, 15 * 32]
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
      "openLoseScreen",
      "finishTurn"
    ]),
    draw(what) {
      const p = this.playerPosition;
      display.clear();
      if (!what || what.includes("floor")) {
        for (let y = 0; y < this.defaultSize.height; y++) {
          for (let x = 0; x < this.defaultSize.width; x++) {
            display.draw(x, y, ".");
          }
        }
      }
      if (!what || what.includes("stairs")) {
        for (let stair of this.stairs) {
          let ch = "<";
          if (stair.id == "stair-down") {
            ch = ">";
          }
          display.draw(stair.x, stair.y, ch);
        }
      }
      if (!what || what.includes("beings")) {
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
      } else if (e.code == "KeyQ") {
        const qSkill = this.player.skills[1];
        qSkill.duration = qSkill.durationByLevel[qSkill.level];
        qSkill.active = true;
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
      for (let skill of this.player.skills) {
        skill.duration -= 1;
        if (!skill.passive && skill.active && skill.duration <= 0) {
          skill.active = false;
        }
      }
      this.finishTurn();
      this.$forceUpdate();
    }
  },
  computed: {
    ...Vuex.mapState(["enemies", "defaultSize", "player", "stairs"]),
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
        this.draw("stairs");
      }, 100);
      setTimeout(() => {
        this.draw("beings");
      }, 200);
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
