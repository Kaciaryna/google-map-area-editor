import {DEFAULT_ZOOM_LEVEL} from "@/models/Consts";

export interface State {
  colors: string[]
  names: string[]
  visiblePolygonIds: number[]
  editedPolygonId: number | null
  highlightedPolygonId: number | null
  loaded: boolean
  zoomLevel: number
}

export const DEFAULT_STATE: State = {
  colors: [],
  names: [],
  visiblePolygonIds: [],
  editedPolygonId: null,
  highlightedPolygonId: null,
  loaded: false,
  zoomLevel: DEFAULT_ZOOM_LEVEL,
}
