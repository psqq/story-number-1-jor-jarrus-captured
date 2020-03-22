<template>
  <div class="game">
    <div class="game-content">
      <PlayerShortInfo></PlayerShortInfo>
      <GameDisplay></GameDisplay>
      <EnemyShortInfo></EnemyShortInfo>
      <div class="btn" @click="openMainMenu">Главное меню</div>
      <div class="btn" @click="openShopScreen">Магазин</div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";
import PlayerShortInfo from '../components/PlayerShortInfo'
import EnemyShortInfo from '../components/EnemyShortInfo'
import GameDisplay from '../components/GameDisplay'

export default {
  name: "MainMenu",
  methods: {
    ...Vuex.mapMutations(["openMainMenu"]),
    ...Vuex.mapMutations(["openShopScreen"]),
  },
  components: {
    PlayerShortInfo,
    EnemyShortInfo,
    GameDisplay,
  },
};
</script>
