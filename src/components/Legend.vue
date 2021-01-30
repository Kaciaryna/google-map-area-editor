<template>
  <div id="legend">
    <table v-show="visiblePolygonIds.length > 0">
      <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Color</th>
        <th>Comment</th>
        <th>Created At</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="polygon in paginatedPolygons"
          :key="polygon.id"
          :class="polygonClass(polygon)"
          @mouseenter="highlight(polygon)"
          @mouseleave="unHighlight(polygon)"
      >
        <td>
          #{{ polygon.id }}
        </td>
        <td>
          <select :value="polygon.name" @change="e => changeName(polygon, e.target.value)">
            <option v-for="name in names" :value="name">{{ name }}</option>
          </select>
        </td>
        <td>
          <select :value="polygon.color" @change="e => changeColor(polygon, e.target.value)">
            <option v-for="color in colors" :value="color">{{ color }}</option>
          </select>
        </td>
        <td>
          <input type="text" :value="polygon.comment" @input="e => changeComment(polygon, e.target.value)"/>
        </td>
        <td>
          {{ polygon.createdAt }}
        </td>
      </tr>
      </tbody>
    </table>
    <div v-show="mapLoading">Please zoom or drag the map</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Polygon} from "@/models/Polygon";
import {mapMutations, mapState} from "vuex";
import unboundState from "@/models/UnboundState";

export default Vue.extend({
  name: 'Legend',
  computed: {
    ...mapState(['colors', 'names', 'visiblePolygonIds', 'highlightedPolygonId', 'editedPolygonId', 'loaded']),
    paginatedIds(): number[] {
      let ids: number[] = this.visiblePolygonIds.slice(0, 30);

      if (this.editedPolygonId) {
        ids = ids.filter(i => i !== this.editedPolygonId);
        ids.unshift(this.editedPolygonId);
      }

      return ids;
    },
    paginatedPolygons(): Polygon[] {
      return this.paginatedIds.map(id => unboundState.polygonData[id]);
    },
    mapLoading() {
      return this.visiblePolygonIds.length === 0 && this.loaded;
    }
  },
  methods: {
    polygonClass(polygon: Polygon) {
      if (this.editedPolygonId === polygon.id) {
        return ["editable"];
      } else if (this.highlightedPolygonId === polygon.id) {
        return ["highlighted"];
      } else {
        return [];
      }
    },
    ...mapMutations(['highlightPolygon','unHighlightPolygon']),
    highlight(polygon: Polygon) {
      this.highlightPolygon(polygon.id);
      unboundState.polygonInstances[polygon.id].setOptions({fillColor: "#fff", strokeColor: "#000"});
    },
    unHighlight(polygon: Polygon) {
      this.unHighlightPolygon();
      unboundState.polygonInstances[polygon.id].setOptions({fillColor: polygon.color, strokeColor: polygon.color})
    },
    changeColor(polygon: Polygon, color: string) {
      polygon.color = color;
      unboundState.polygonInstances[polygon.id].setOptions({fillColor: polygon.color, strokeColor: polygon.color})
    },
    changeName(polygon: Polygon, name: string) {
      polygon.name = name;
    },
    changeComment(polygon: Polygon, comment: string) {
      polygon.comment = comment;
    },
  }
});
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
}

td,
th {
  border-bottom: 1px solid #ccc;
  padding: 4px 10px;
}

.highlighted {
  td {
    background-color: #E6E6FA;
  }
}

.editable {
  td {
    background-color: #9ACD32;
  }
}
</style>
