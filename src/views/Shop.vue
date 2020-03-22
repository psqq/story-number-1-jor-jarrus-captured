<template>
  <div class="shop">
    <div class="shop-content">
      <h2>Магазин</h2>
      <PlayerShortInfo></PlayerShortInfo>
      <hr />
      <div v-for="(item, index) in items" :key="item.id">
        <hr v-if="index" />
        <b>{{ item.name }}</b>
        <div v-if="item.required">
          Состовляющие:
          <span v-for="(reqItem, reqItemIndex) in item.required" :key="reqItemIndex">
            <template v-if="reqItemIndex">,</template>
            {{ getItemNameById(reqItem) }}
          </span>
        </div>
        <p>Цена: {{ item.cost }}</p>
        <p>
          <i>{{ item.desc }}</i>
        </p>
        <u>Пассивные эффекты:</u>
        <p v-for="(passiveEffect, index2) in item.passives" :key="index2">
          <template v-if="passiveEffect.name == 'flat-bonus-ad'">
            <b>+{{passiveEffect.value}}</b> бонусного урона
          </template>
        </p>
        <button @click="tryBuyItem(item)">Купить предмет</button>
      </div>
      <p></p>
      <hr />
      <div class="btn" @click="openGameScreen">Вернуться в игру</div>
    </div>
  </div>
</template>

<script>
import Vuex from "vuex";
import PlayerShortInfo from "../components/PlayerShortInfo";

export default {
  name: "Shop",
  methods: {
    ...Vuex.mapMutations(["openGameScreen", "buyItem"]),
    tryBuyItem(item) {
      if (item.cost <= this.player.gold) {
        this.buyItem({ itemId: item.id });
      }
    }
  },
  computed: {
    ...Vuex.mapState(["items", "player"]),
    ...Vuex.mapGetters(["getItemNameById"])
  },
  components: {
    PlayerShortInfo
  }
};
</script>
