<template>
  <div class="player-short-info">
    Ваши статы:
    <BeingBaseInfo :being="player"></BeingBaseInfo>
  </div>
</template>

<script>
import Vuex from "vuex";
import BeingBaseInfo from "./BeingBaseInfo";

export default {
  name: "PlayerShortInfo",
  computed: {
    ...Vuex.mapState(['player']),
  },
  components: {
    BeingBaseInfo,
  },
};
</script>
