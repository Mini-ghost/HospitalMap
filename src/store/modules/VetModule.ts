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

type VetFilter = {
  search: string;
  district: number;
  pets: string[];
  status: boolean;
}

const key = '1B1eNzcuoSqxskYxoHynO3EOj49Pchjg_8RkyjjcQIMo'
const url = `https://spreadsheets.google.com/feeds/list/${key}/1/public/values?alt=json`

@Module({
  name: 'vetModule',
  namespaced: true
})
export default class VetModule extends VuexModule {
  districts = [
    { name: '中區', id: 400 },
    { name: '東區', id: 401 },
    { name: '南區', id: 402 },
    { name: '西區', id: 403 },
    { name: '北區', id: 404 },
    { name: '北屯區', id: 406 },
    { name: '西屯區', id: 407 },
    { name: '南屯區', id: 408 },
    { name: '太平區', id: 411 },
    { name: '大里區', id: 412 },
    { name: '霧峰區', id: 413 },
    { name: '烏日區', id: 414 },
    { name: '豐原區', id: 420 },
    { name: '后里區', id: 421 },
    { name: '石岡區', id: 422 },
    { name: '東勢區', id: 423 },
    { name: '和平區', id: 424 },
    { name: '新社區', id: 426 },
    { name: '潭子區', id: 427 },
    { name: '大雅區', id: 428 },
    { name: '神岡區', id: 429 },
    { name: '大肚區', id: 432 },
    { name: '沙鹿區', id: 433 },
    { name: '龍井區', id: 434 },
    { name: '梧棲區', id: 435 },
    { name: '清水區', id: 436 },
    { name: '大甲區', id: 437 },
    { name: '外埔區', id: 438 },
    { name: '大安區', id: 439 }
  ]

  pets = [
    { name: '貓', id: 'cat' },
    { name: '狗', id: 'dog' },
    { name: '老鼠', id: 'mouse' },
    { name: '兔子', id: 'rabbit' },
    { name: '蜜袋鼯', id: 'honeyBag' },
    { name: '鳥類', id: 'bird' },
    { name: '爬蟲類', id: 'reptile' }
  ]

  vetData: Readonly<VetData[]> = []
  vetDetail: VetData | null = null

  /**
   * 篩選條件
   */
  vetFilter: VetFilter = {
    /** 文字搜尋框 */
    search: '',
    /** 
     * 區域郵遞區號
     * 全選為 0
     */
    district: 0,
    /**
     * 動物分類 id 陣列
     * 全選留空白
     */
    pets: [],
    /**
     * 當下是否為營業狀態
     */
    status: true,
  }

  /**
   * 條件篩選過後的 vetData
   */
  get syncVetData () {
    const { vetFilter: filter } =  this
    return this.vetData
      .filter(({ name }) => name.includes(filter.search))
      .filter(({ district }) => {
        const name = this.districts.find(({ id }) => (
          id === filter.district
        ))?.name
        return !name || (district === name)
      })
  }

  @Mutation
  SET_SEARCH(filter: string | Partial<VetModule['vetFilter']>) {
    console.log(filter)
    if (typeof filter === 'string') {
      filter = {
        search: filter
      }
    }

    this.vetFilter = {
      ...this.vetFilter,
      ...filter
    }
  }

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
