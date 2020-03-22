<template>
  <div class="player-short-info">
    <div class="player-stats">
      <u>Ваши статы:</u>
      <BeingBaseInfo :being="player"></BeingBaseInfo>
    </div>
    <p>Золото: {{ player.gold }}$ </p>
  </div>
</template>

<script>
import Vuex from "vuex";
import BeingBaseInfo from "./BeingBaseInfo";

export default {
  name: "PlayerShortInfo",
  computed: {
    ...Vuex.mapState(["player"])
  },
  components: {
    BeingBaseInfo
  }
};
</script>

<style scoped>
.player-stats {
  display: grid;
  grid-template-columns: auto auto;
}
</style>
