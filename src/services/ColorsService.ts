import {Storage} from "@/services/Storage";

const colors =   [
  "IndianRed", "HotPink", "DarkOrange", "SlateBlue", "YellowGreen", "LightSeaGreen", "LightSlateGray"
]

export default class ColorsService implements Storage<string> {
  async getAll(): Promise<string[]> {
    return colors
  }
}
