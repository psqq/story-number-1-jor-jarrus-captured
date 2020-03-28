<template>
  <div id="app">
    <MainMenu v-if="screen == 'mainmenu'"></MainMenu>
    <Game v-else-if="screen == 'game'"></Game>
    <Shop v-else-if="screen == 'shop'"></Shop>
    <Lose v-else-if="screen == 'lose'"></Lose>
    <div v-else>
      Странно, но вы недолжны этого видеть! :(
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';

import MainMenu from './views/MainMenu';
import Game from './views/Game';
import Shop from './views/Shop';
import Lose from './views/Lose';

export default {
  name: "App",
  components: {
    MainMenu,
    Game,
    Shop,
    Lose,
  },
  computed: {
    ...Vuex.mapState(['screen']),
  },
};
</script>

<style>
.mainmenu, .game, .lose, .shop {
  display: grid;
  align-items: center;
  justify-items: center;
}

.mainmenu-content, .game-content, .lose-content, .shop-content {
  max-width: 700px;
}

.btn {
  border: 1px solid black;
  padding: 5px;
  width: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
}

.btn:hover {
  cursor: pointer;
}

h2 {
  text-align: center;
}
</style>
