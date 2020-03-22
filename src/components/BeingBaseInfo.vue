<template>
  <div>
    <p>
      Здоровье: {{ being.hp }} / {{ being.maxHp }}
      | Урон:
      {{ being.ad }}
      <template
        v-if="being.bonusAd"
      >+ {{ being.bonusAd }} = {{ being.ad + being.bonusAd}}</template>
    </p>
  </div>
</template>

<script>
export default {
  name: "BeignBaseInfo",
  props: ["being"],
};
</script>
