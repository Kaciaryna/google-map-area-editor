import {ActionContext} from "vuex";
import {State} from "@/models/State";
import {GoogleMap} from "@googlemaps/map-loader";
import FeaturesService from "@/services/FeaturesService";
import ColorsService from "@/services/ColorsService";
import NamesService from "@/services/NamesService";
import {
  checkVisibility,
  copyBounds,
  defineMapBounds,
  MapBounds,
  recalculateTotalBounds
} from "@/models/MapBounds";
import {attachPolygonsToRegions, divideLine} from "@/models/Region";
import {processFeatures} from "@/models/Feature";
import {DEFAULT_ZOOM_LEVEL, MAX_INTERACTION_ZOOM_LEVEL} from "@/models/Consts";
import unboundState, {getMapInstance} from "@/models/UnboundState";
import {
  createPolygonData,
  createPolygonInstance,
  Polygon,
  updatePolygonBounds
} from "@/models/Polygon";
import randomize from "@/utils/randomize";

type Ctx = ActionContext<State, State>;

function attachGlobalMapListeners(context: Ctx, mapInstance: google.maps.Map, totalBounds: MapBounds) {
  mapInstance.setCenter({
    lat: divideLine(totalBounds.sw.lat, totalBounds.ne.lat, 2)[0][1],
    lng: divideLine(totalBounds.sw.lng, totalBounds.ne.lng, 2)[0][1],
  });

  mapInstance.addListener('dragend', () => {
    context.dispatch("redrawPolygons");
  })

  mapInstance.addListener('zoom_changed', () => {
    context.commit("setZoom", mapInstance.getZoom());
    context.dispatch("redrawPolygons");
  })
}

function attachLocalMapListeners(context: Ctx, polygonData: Polygon, polygonInstance: google.maps.Polygon) {
  polygonInstance.addListener('mouseover', () => {
    if (context.state.zoomLevel < MAX_INTERACTION_ZOOM_LEVEL) {
      return;
    }

    if (context.state.highlightedPolygonId !== polygonData.id) {
      polygonInstance.setOptions({fillColor: "#fff", strokeColor: "#000"});
      context.commit("highlightPolygon", polygonData.id)
    }
  })

  polygonInstance.addListener('mouseout', () => {
    if (context.state.zoomLevel < MAX_INTERACTION_ZOOM_LEVEL) {
      return;
    }

    polygonInstance.setOptions({fillColor: polygonData.color, strokeColor: polygonData.color})
    if (context.state.highlightedPolygonId === polygonData.id) {
      context.commit("unHighlightPolygon")
    }
  })

  polygonInstance.addListener('click', () => {
    if (context.state.zoomLevel < MAX_INTERACTION_ZOOM_LEVEL) {
      return;
    }

    const prevId = context.state.editedPolygonId;

    if (prevId === null) {
      context.commit("setEditedPolygonId", polygonData.id);
      polygonInstance.setEditable(true);

    } else if (prevId !== polygonData.id) {
      unboundState.polygonInstances[prevId].setEditable(false)
      polygonInstance.setEditable(true)
      context.commit("setEditedPolygonId", polygonData.id);

    } else if (prevId === polygonData.id) {

      updatePolygonGeometry(polygonInstance, polygonData);

      polygonInstance.setEditable(false)
      context.commit("setEditedPolygonId", null);
    }
  });
}

function updatePolygonGeometry(instance: google.maps.Polygon, data: Polygon) {
  unboundState.regions.forEach(region => {
    if (checkVisibility(data.bounds, region.bounds)) {
      region.polygonIds = region.polygonIds.filter(i => i !== data.id);
    }
  });

  updatePolygonBounds(instance, data);

  unboundState.regions.forEach(region => {
    if (checkVisibility(data.bounds, region.bounds)) {
      region.polygonIds.push(data.id);
    }
  });
}

const actions = {
  async loadColors(context: Ctx): Promise<string[]> {
    const colors = await new ColorsService().getAll()
    context.commit('setColors', colors);
    return colors;
  },
  async loadNames(context: Ctx): Promise<string[]> {
    const names = await new NamesService().getAll()
    context.commit('setNames', names);
    return names;
  },
  async loadMap(_context: Ctx): Promise<google.maps.Map> {
    const mapLoaderOptions = {
      apiKey: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
      divId: 'map',
      append: false,
      mapOptions: {
        center: {
          lat: 0,
          lng: 0,
        },
        zoom: DEFAULT_ZOOM_LEVEL
      }
    }

    unboundState.map = await new GoogleMap().initMap(mapLoaderOptions);

    return new Promise(resolve => {
      const listener = getMapInstance().addListener('bounds_changed', function () {
        listener.remove(); //trigger it once when map is fully loaded
        resolve(getMapInstance());
      });
    });
  },
  async redrawPolygons(context: Ctx) {
    const newVisibleIds: Set<number> = new Set();
    const mapBounds = defineMapBounds(getMapInstance());

    unboundState.regions.forEach(region => {
      if (checkVisibility(region.bounds, mapBounds)) {
        region.polygonIds.forEach(id => {
          if (checkVisibility(unboundState.polygonData[id].bounds, mapBounds)) {
            newVisibleIds.add(id);
            unboundState.polygonInstances[id].setVisible(true);
          }
        });
      }
    });

    const oldInvisibleIds = context.state.visiblePolygonIds.filter(x => !newVisibleIds.has(x));
    oldInvisibleIds.forEach(id => {
      unboundState.polygonInstances[id].setVisible(false);
    })

    context.commit('setVisiblePolygonIds', [...newVisibleIds]);
  },
  async setInitialData(context: Ctx) {
    const mapInstance: google.maps.Map = await context.dispatch("loadMap");
    const features = await new FeaturesService().getAll();
    const colors = await context.dispatch("loadColors")
    const names = await context.dispatch("loadNames")

    let totalBounds: MapBounds | undefined;

    processFeatures(features, (product => {
      if (!totalBounds) {
        totalBounds = copyBounds(product.bounds);
      }
      totalBounds = recalculateTotalBounds(product.bounds, totalBounds);

      const polygonData = createPolygonData(product.id, product.bounds, randomize(colors), randomize(names));
      const polygonInstance = createPolygonInstance(product.paths, polygonData.color);

      attachLocalMapListeners(context, polygonData, polygonInstance);

      unboundState.polygonData[polygonData.id] = polygonData;
      unboundState.polygonInstances[polygonData.id] = polygonInstance;

      polygonInstance.setMap(mapInstance);
    }));

    if (totalBounds != null) {
      attachGlobalMapListeners(context, mapInstance, totalBounds);
      unboundState.regions = attachPolygonsToRegions(totalBounds, unboundState.polygonData);
    }

    await context.dispatch("redrawPolygons");
  }
}

export default actions;
