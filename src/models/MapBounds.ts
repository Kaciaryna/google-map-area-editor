import LatLngLiteral = google.maps.LatLngLiteral;
import LatLngBounds = google.maps.LatLngBounds;

export interface MapBounds {
  sw: google.maps.LatLngLiteral
  ne: google.maps.LatLngLiteral
}

export function emptyBounds(): MapBounds {
  return {sw: {lng: 0, lat: 0}, ne: {lng: 0, lat: 0}};
}

export function copyBounds(bounds: MapBounds): MapBounds {
  return {
    sw: {lng: bounds.sw.lng, lat: bounds.sw.lat},
    ne: {lng: bounds.ne.lng, lat: bounds.ne.lat},
  }
}

export function recalculateTotalBounds(current: MapBounds, total: MapBounds): MapBounds {
  return {
    sw: recalculateBounds(current.sw, total).sw,
    ne: recalculateBounds(current.ne, total).ne,
  };
}

export function recalculateBounds(current: LatLngLiteral, bounds: MapBounds): MapBounds {
  const {sw, ne} = copyBounds(bounds);

  if (current.lng > ne.lng) {
    ne.lng = current.lng
  } else if (current.lng < sw.lng) {
    sw.lng = current.lng
  }

  if (current.lat > ne.lat) {
    ne.lat = current.lat
  } else if (current.lat < sw.lat) {
    sw.lat = current.lat
  }

  return {
    sw,
    ne,
  }
}

export function checkVisibility(rectBounds: MapBounds, mapBounds: MapBounds): boolean {
  if(
    (rectBounds.ne.lat > mapBounds.ne.lat && rectBounds.sw.lat > mapBounds.ne.lat) ||
    (rectBounds.ne.lat < mapBounds.sw.lat && rectBounds.sw.lat < mapBounds.sw.lat)) {
    return false;
  }

  return !(
    (rectBounds.ne.lng > mapBounds.ne.lng && rectBounds.sw.lng > mapBounds.ne.lng) ||
    (rectBounds.ne.lng < mapBounds.sw.lng && rectBounds.sw.lng < mapBounds.sw.lng)
  );
}

export function defineMapBounds(map: google.maps.Map): MapBounds {
  const mapBounds = map.getBounds();

  const sw = (mapBounds as LatLngBounds).getSouthWest();
  const ne = (mapBounds as LatLngBounds).getNorthEast();

  return  {
    sw: {lat: sw.lat(), lng: sw.lng()},
    ne: {lat: ne.lat(), lng: ne.lng()},
  }
}

