import {LatLngPaths} from "@/models/Polygon";
import {emptyBounds, MapBounds, recalculateBounds} from "@/models/MapBounds";
import LatLngLiteral = google.maps.LatLngLiteral;

export type CoordinatesTuple = [number, number];

export interface Feature {
  type: string
  id: number
  geometry: {
    type: string
    coordinates: CoordinatesTuple[][] | CoordinatesTuple[][][]
  },
  properties: {
    OBJECTID: number
    ElectDist: number
    Shape__Area: number
    Shape__Length: number
  }
}

export interface SingleFeature extends Feature {
  geometry: {
    type: string
    coordinates: CoordinatesTuple[][]
  }
}

export interface MultipleFeature extends Feature {
  geometry: {
    type: string
    coordinates: CoordinatesTuple[][][]
  }
}

export interface FeatureProduct {
  id: number;
  bounds: MapBounds;
  paths: LatLngPaths;
}

export function processFeatures(
  features: Feature[],
  callback: (product: FeatureProduct) => void
) {
  features.forEach((feature, id) => {
    let bounds = emptyBounds();
    let paths: LatLngPaths = [];

    if (feature.geometry.type === "MultiPolygon") {
      const coords = (feature as MultipleFeature).geometry.coordinates;
      bounds.sw = {lat: coords[0][0][0][1], lng: coords[0][0][0][0]};
      bounds.ne = {lat: coords[0][0][0][1], lng: coords[0][0][0][0]};

      const multiPolygonCoordinates = coords.map((c) => {
        return c.map((items) => {
          return items.map((item) => {
            const currentPoint: LatLngLiteral = {lng: item[0], lat: item[1]};
            bounds = recalculateBounds(currentPoint, bounds)
            return currentPoint;
          })
        })
      })
      paths = [...multiPolygonCoordinates[0], ...multiPolygonCoordinates[1]]

    } else if (feature.geometry.type === "Polygon") {
      const coords = (feature as SingleFeature).geometry.coordinates[0];
      bounds.sw = {lat: coords[0][1], lng: coords[0][0]};
      bounds.ne = {lat: coords[0][1], lng: coords[0][0]};

      paths = coords.map((c) => {
        const currentPoint: LatLngLiteral = {lng: c[0], lat: c[1]};
        bounds = recalculateBounds(currentPoint, bounds)
        return currentPoint;
      })
    } else {
      throw new Error(`Unknown geometry: ${feature.geometry.type}`);
    }

    callback({
      id,
      bounds,
      paths,
    });
  });
}
