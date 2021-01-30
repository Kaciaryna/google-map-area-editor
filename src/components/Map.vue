<template>
  <div id="map"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapMutations} from "vuex";

export default Vue.extend({
  name: 'Map',
  async mounted() {
    await this.setInitialData();
    this.setLoaded(true);
  },
  methods: {
    ...mapMutations(['setLoaded']),
    ...mapActions(['setInitialData']),
  }
});
</script>

<style lang="scss" scoped>
#map {
  width: 50vw;
  height: 80vh;

  &.visible {
    display: block;
  }
}
</style>
