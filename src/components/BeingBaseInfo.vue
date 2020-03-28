<template>
  <div class="base-info">
    <Bar v-bind:currentValue="being.hp" v-bind:maxValue="being.maxHp"></Bar>
    <span>
      Урон:
      {{ being.ad }}
      <template
        v-if="being.bonusAd"
      >+ {{ being.bonusAd }} = {{ being.ad + being.bonusAd}}</template>
    </span>
  </div>
</template>

<script>
import Bar from "./Bar";

export default {
  name: "BeignBaseInfo",
  props: ["being"],
  components: {
    Bar
  }
};
</script>

<style>
.base-info {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  grid-gap: 2vw;
  margin: 5px;
}
</style>
