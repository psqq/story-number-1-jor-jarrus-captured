<template>
  <div class="hp-cont" v-bind:style="{ 'grid-template-columns': templateColumns }">
    <div class="curr-hp-bar"></div>
    <div class="lost-hp-bar"></div>
    <div class="hp-msg">{{ currentValue }} / {{ maxValue }}</div>
  </div>
</template>

<script>
export default {
  name: "Bar",
  props: {
    currentValue: {
      default: 100
    },
    maxValue: {
      default: 100
    },
    currentValueColor: {
      default: "black"
    },
    maxValueColor: {
      default: "grey"
    },
    textColor: {
      default: "white"
    }
  },
  computed: {
    currentPercent() {
      return Math.floor((this.currentValue / this.maxValue) * 100);
    },
    templateColumns() {
      const maxFrSize = 1000;
      const currentPercent = Math.floor((this.currentValue / this.maxValue) * maxFrSize);
      const lostPercent = maxFrSize - currentPercent;
      return `${currentPercent}fr ${lostPercent}fr`;
    }
  }
};
</script>

<style scoped>
.hp-cont {
  display: grid;
  max-width: 500px;
  background-color: black;
  color: white;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "a b";
}

.curr-hp-bar {
  background-color: rgb(227, 59, 59);
  grid-area: a;
}

.lost-hp-bar {
  background-color: rgb(172, 179, 191);
  grid-area: b;
}

.hp-msg {
  grid-area: 1 / 1 / 2 / 3;
  align-self: center;
  justify-self: center;
  padding: 5px;
}
</style>
