<template>
  <div class="player-short-info">
    <div class="player-stats">
      <u>Ваши статы:</u>
      <Bar v-bind:currentValue="player.hp" v-bind:maxValue="player.maxHp"></Bar>
      <BeingBaseInfo :being="player"></BeingBaseInfo>
    </div>
    <p>Золото: {{ player.gold }}$ </p>
  </div>
</template>

<script>
import Vuex from "vuex";
import BeingBaseInfo from "./BeingBaseInfo";
import Bar from "./Bar";

export default {
  name: "PlayerShortInfo",
  computed: {
    ...Vuex.mapState(["player"])
  },
  components: {
    BeingBaseInfo,
    Bar,
  }
};
</script>

<style scoped>
.player-stats {
  display: grid;
  grid-template-columns: auto auto;
}
</style>
