import {Feature} from "@/models/Feature";
import {Storage} from "@/services/Storage";
import {FeatureCollection} from "@/models/FeatureCollection";

export default class FeaturesService implements Storage<Feature> {
  async getAll(): Promise<Feature[]> {
    const data = await fetch('query.json')
    const collection = await data.json() as FeatureCollection

    return collection.features
  }
}
