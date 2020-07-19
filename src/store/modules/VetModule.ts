import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import type { LegacyVetData } from '@/store/modules/VetModule.type'

export interface VetData {
  name: string;
  phone: string;
  time: string;
  detailTime: string[];
  webURL: string;
  facebook: string;
  coordinates: [number, number];
  district: string;
  address: string;
  is24hr: boolean;
  pet: string[];
  service: string[];
  outward: string;
}

const key = '1B1eNzcuoSqxskYxoHynO3EOj49Pchjg_8RkyjjcQIMo'
const url = `https://spreadsheets.google.com/feeds/list/${key}/1/public/values?alt=json`

@Module({
  name: 'vetModule',
  namespaced: true
})
export default class VetModule extends VuexModule {
  vetData: Readonly<VetData[]> = []
  vetDetail: VetData | null = null

  @Mutation
  SET_VET_DATA(json: LegacyVetData[]) {
    const initData = json.map(item => ({
      name: item.gsx$醫院名稱.$t,
      phone: item.gsx$電話號碼.$t,
      time: item.gsx$營業日.$t,
      detailTime: [
          item.gsx$週一看診時間.$t,
          item.gsx$週二看診時間.$t,
          item.gsx$週三看診時間.$t,
          item.gsx$週四看診時間.$t,
          item.gsx$週五看診時間.$t,
          item.gsx$週六看診時間.$t,
          item.gsx$週日看診時間.$t
      ],
      webURL: item.gsx$網站網址.$t,
      facebook: item.gsx$粉絲專頁網址.$t,
      coordinates:
        item.gsx$座標.$t
          .split(",")
          .map(str => parseFloat(str))
          .reverse() as VetData['coordinates'],
      district: item.gsx$地區.$t,
      address: item.gsx$地址.$t,
      is24hr: item.gsx$是否為24h.$t !== "否",
      pet: item.gsx$適用寵物類型.$t.split(", "),
      service: item.gsx$服務類別.$t.split(", "),
      outward: item.gsx$外觀照片網址.$t,
    }))
    this.vetData = Object.freeze(initData)
  }

  @Mutation
  SET_VET_DETAIL(detail?: VetData) {
    if (detail) {
      this.vetDetail = detail
      console.log(this.vetDetail)
      return
    }
    this.vetDetail = null
  }

  /**
   * 取得初始資料
   */
  @Action
  async GET_VET_DATA () {
    const json = await fetch(url)
      .then(res => res.json())
      .catch(error => { throw error })

    this.SET_VET_DATA(json.feed.entry as LegacyVetData[])
  }

  /**
   * 取的詳細動醫院資訊
   */
  @Action
  async GET_VET_DETAIL(id: string) {
    const vetDeatil = this.vetData.find((item) => item.name === id)

    if (vetDeatil) {
      this.SET_VET_DETAIL(vetDeatil)
      return Promise.resolve(vetDeatil)
    }
    
    return Promise.reject()
  }
}
