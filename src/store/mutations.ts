import {State} from "@/models/State";

const mutations = {
  setColors(state: State, payload: string[]) {
    state.colors = payload;
  },
  setNames(state: State, payload: string[]) {
    state.names = payload;
  },
  highlightPolygon(state: State, payload: number) {
    state.highlightedPolygonId = payload;
  },
  unHighlightPolygon(state: State) {
    state.highlightedPolygonId = null;
  },
  setEditedPolygonId(state: State, payload: number) {
    state.editedPolygonId = payload
  },
  setVisiblePolygonIds(state: State, payload: number[] ) {
    state.visiblePolygonIds = payload;
  },
  setLoaded(state: State, payload: boolean) {
    state.loaded = payload
  },
  setZoom(state: State, zoomLevel: number) {
    state.zoomLevel = zoomLevel
  },
}

export default mutations;
