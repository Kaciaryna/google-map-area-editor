import {Feature} from "./Feature";

export interface FeatureCollection {
  type: string
  crs: {
    type: string
    properties: {
      name: string
    }
  }
  features: Feature[]
}
