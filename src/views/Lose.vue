<template>
  <div class="lose">
    <div class="lose-content">
      <h2>Вы проиграли :(</h2>
      <div class="btn" @click="openMainMenu">Главное меню</div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";

export default {
  name: "Lose",
  methods: {
    ...Vuex.mapMutations(["openMainMenu"]),
  },
};
</script>
