<template>
  <div class="map" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import mapboxgl from 'mapbox-gl'

import { vetModule } from '@/store'

const POINT_NAME = 'point'
const USER_NAME = 'user'

mapboxgl.accessToken = process.env.VUE_APP_MAP_TOKEN

@Component<TheMapBox>({
  name: 'TheMapBox',
  created () {
    vetModule.GET_VET_DATA()
      .then(this.mapAddVetLayer)
  },
  mounted() {
    // 初始化 MapBox GL js
    this._map = new mapboxgl.Map({
      container: this.$el,
      style: 'mapbox://styles/mapbox/streets-v11',
      // 預設中心定位座標：台中火車站座標
      center: [120.6855716, 24.1372617],
      zoom: 14
    })

    this.mapLoadImage()
    this.mapAddEventListener()
  }
})
export default class TheMapBox extends Vue {
  private _map!: mapboxgl.Map

  $el!: HTMLElement

  mapAddEventListener (): void {
    this._map
      .on('load', this.onLoad)
      .on('click', this.onClick)
      .on('mouseenter', POINT_NAME, this.onMouseEnterLayer)
      .on('mouseleave', POINT_NAME, this.onMouseLeaveLayer)
  }

  onLoad () {
    this.getGeolocation()
      .then(({ center }) => {

        const source = {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: center },
                properties: { icon: USER_NAME }
              }
            ]
          },
          cluster: true,
          clusterRadius: 15
        } as mapboxgl.GeoJSONSourceRaw

        this._map
          .setCenter(center)
          .addSource(USER_NAME, source)
          .addLayer({
            id: USER_NAME,
            type: 'symbol',
            source: USER_NAME,
            minzoom: 5,
            layout: {
              'icon-image': ['get', 'icon']
            }
          })
    })
  }

  onClick ({ point }: mapboxgl.MapMouseEvent): void {
    const features =
      this._map.queryRenderedFeatures(point, { layers: [POINT_NAME] })

    if(features.length) {
      const [ feature ] = features

      // https://stackoverflow.com/questions/55621480/cant-access-coordinates-member-of-geojson-feature-collection
      if(feature.geometry.type !== 'Point') return
      // 座標
      const { coordinates } = feature.geometry
      // 動物醫院 id
      const { id } = feature.properties as {[key: string]: string}

      this._map.flyTo({
        center: coordinates as [number, number],
        duration: 500,
        zoom: 14
      })

      vetModule.GET_VET_DETAIL(id)
      return
    }

    vetModule.SET_VET_DETAIL()
  }

  onMouseEnterLayer (): void {
    this._map.getCanvas().style.cursor = 'pointer'
  }

  onMouseLeaveLayer (): void {
    this._map.getCanvas().style.cursor = ''
  }

  /**
   * 載入標記用圖片
   */
  mapLoadImage () {
    // 一般動物醫院標記
    this._map
      .loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error: Error, image: ImageData) => {
          if (error) throw error
          this._map.addImage(POINT_NAME, image)
        }
      )

    // 使用者標記
    this._map
      .loadImage(
        'https://avatars0.githubusercontent.com/u/39984251?s=30&v=4',
        (error: Error, image: ImageData) => {
          if (error) throw error
          this._map.addImage(USER_NAME, image)
        }
      )
  }

  /**
   * 畫上動物醫院標記
   */
  mapAddVetLayer () {
    const features = vetModule.vetData
      .map(item => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: item.coordinates },
        properties: {
          id: item.name,
          icon: POINT_NAME
        }
      }))

    const source = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      }
    } as mapboxgl.GeoJSONSourceRaw

    this._map.addSource('vet-map', source)
    this._map.addLayer({
      id: POINT_NAME,
      type: 'symbol',
      source: 'vet-map',
      minzoom: 5,
      layout: {
        'icon-image': ['get', 'icon']
      }
    })
  }

  getGeolocation () {
    return new Promise<{ type: boolean; center: [number, number] }>(resolve => {
      navigator.geolocation.getCurrentPosition (
        ({ coords }) => {
          resolve({
            type: true,
            center: [coords.longitude, coords.latitude]
          })
        },
        () => {
          // 如果使用者拒絕取得定位資訊
          // 回傳預設定位
          const { lng, lat } = this._map.getCenter()
          resolve({
            type: false,
            center: [lng, lat]
          })
        }
      )
    })
  }
}
</script>
