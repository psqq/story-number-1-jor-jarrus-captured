<template>
  <div class="enemy-short-info">
    <template v-if="enemy">
      <p>Информация о враге:</p>
      <BeingBaseInfo :being="enemy"></BeingBaseInfo>
    </template>
    <template v-else>
      <p>Вы не кого не атаковали в последнее время.</p>
    </template>
  </div>
</template>

<script>
import Vuex from "vuex";
import BeingBaseInfo from "./BeingBaseInfo";

export default {
  name: "EnemyShortInfo",
  computed: {
    ...Vuex.mapGetters({
      enemy: "getCurrentEnemy"
    })
  },
  components: {
    BeingBaseInfo
  }
};
</script>
