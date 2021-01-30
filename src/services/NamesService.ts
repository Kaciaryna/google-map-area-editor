import {Storage} from "@/services/Storage";

const names = [
  "Svalbard",
  "Cargados",
  "Fundy",
  "Grenadines",
  "Hudson",
  "Fernandez",
  "Keeling",
  "Kodiak",
  "Palikir",
  "Perouse",
  "Brandon",
  "Severnaya",
  "Shikotan",
  "Swains",
  "Tristan",
  "Van",
  "Wakhan",
  "Barbados",
  "Bhutan",
  "Midway"
]


export default class NamesService implements Storage<string> {
  async getAll(): Promise<string[]> {
    return names
  }
}
