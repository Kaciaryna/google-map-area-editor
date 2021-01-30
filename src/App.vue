<template>
  <div id="app">
    <div class="content">
      <Map></Map>
      <Legend></Legend>
      <div v-if="!loaded" class="overlay"><h1>Loading...</h1></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Map from "@/components/Map.vue";
import Legend from "@/components/Legend.vue";
import {mapState} from "vuex";

export default Vue.extend({
  name: 'App',
  components: {
    Map,
    Legend
  },
  computed: {
    ...mapState(['loaded'])
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}

.overlay {
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.content {
  display: flex;
}
</style>
