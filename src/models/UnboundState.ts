import {PolygonInstanceMap, PolygonMap} from "@/models/Polygon";
import {Region} from "@/models/Region";

export interface UnboundState {
  map: google.maps.Map | null;
  polygonData: PolygonMap;
  polygonInstances: PolygonInstanceMap;
  regions: Region[];
}

const unboundState: UnboundState = {
  map: null,
  polygonData: {},
  polygonInstances: {},
  regions: [],
}

export default unboundState;

export function getMapInstance(): google.maps.Map {
  if (unboundState.map) {
    return unboundState.map;
  }

  throw new Error("Map instance is not defined");
}
