import {MapBounds, recalculateBounds} from "@/models/MapBounds";
import LatLngLiteral = google.maps.LatLngLiteral;

export interface PolygonMap {
  [id: number]: Polygon;
}

export interface PolygonInstanceMap {
  [id: number]: google.maps.Polygon
}

export type LatLngPaths = LatLngLiteral[] | LatLngLiteral[][];

export interface Polygon {
  id: number
  bounds: MapBounds
  color: string
  name: string
  comment: string
  createdAt: string
}

export function createPolygonData(id: number, bounds: MapBounds, color: string, name: string): Polygon {
  return {
    id,
    bounds,
    color,
    name,
    comment: "",
    createdAt: new Date().toDateString(),
  };
}

export function createPolygonInstance(paths: LatLngPaths, color: string): google.maps.Polygon {
  return new google.maps.Polygon({
    paths,
    visible: false,
    strokeColor: color,
    fillColor: color,
    fillOpacity: 0.5,
  });
}

export function updatePolygonBounds(instance: google.maps.Polygon, data: Polygon) {
  const paths: LatLngLiteral[][] = [];

  instance.getPaths().forEach(arr => {
    const path: LatLngLiteral[] = [];
    arr.forEach(p => {
      path.push({lng: p.lng(), lat: p.lat()})
    });

    paths.push(path);
  });

  let newBounds = {
    sw: {lat: paths[0][0].lat, lng: paths[0][0].lng},
    ne: {lat: paths[0][0].lat, lng: paths[0][0].lng}
  }

  paths.forEach(path => {
    path.forEach(point => {
      newBounds = recalculateBounds(point, newBounds);
    });
  });

  data.bounds = newBounds
}
