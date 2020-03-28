<template>
  <div class="player-short-info">
    <u>Ваши статы:</u>
    <div class=".player-stats">
      <BeingBaseInfo :being="player"></BeingBaseInfo>
      <span>Золото: {{ player.gold }}$ </span>
    </div>
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
  grid-template-columns: 1fr 1fr;
}
</style>
