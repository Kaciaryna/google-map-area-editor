import {checkVisibility, MapBounds} from "@/models/MapBounds";
import {CoordinatesTuple} from "@/models/Feature";
import {PolygonMap} from "@/models/Polygon";

export interface Region {
  bounds: MapBounds;
  polygonIds: number[];
}

const REGIONS_SIZE_X = 5;
const REGIONS_SIZE_Y = 5;

export function divideLine(start: number, end: number, steps: number): CoordinatesTuple[] {
  const step = (end - start) / steps;
  const points: CoordinatesTuple[] = [];

  for (let x = 0; x < steps; x++) {
    switch (x) {
      case 0:
        points.push([start, start + step]);
        break;

      case steps - 1:
        points.push([points[x - 1][1], end]);
        break;

      default:
        points.push([points[x - 1][1], points[x - 1][1] + step]);
    }
  }

  return points;
}

export function createSubRegions(bounds: MapBounds): Region[] {
  const regions: Region[] = [];

  const lngPoints = divideLine(bounds.sw.lng, bounds.ne.lng, REGIONS_SIZE_X);
  const latPoints = divideLine(bounds.sw.lat, bounds.ne.lat, REGIONS_SIZE_Y);

  lngPoints.forEach(lngCoords => {
    latPoints.forEach(latCoords => {
      regions.push({
        bounds: {
          sw: {lng: lngCoords[0], lat: latCoords[0]},
          ne: {lng: lngCoords[1], lat: latCoords[1]},
        },
        polygonIds: [],
      });
    });
  });

  return regions;
}

export function attachPolygonsToRegions(totalBounds: MapBounds, polygonsData: PolygonMap): Region[] {
  const regions = createSubRegions(totalBounds);

  Object.values(polygonsData).forEach(polygon => {
    regions.forEach(region => {
      if (checkVisibility(polygon.bounds, region.bounds)) {
        region.polygonIds.push(polygon.id);
      }
    })
  });

  return regions;
}
