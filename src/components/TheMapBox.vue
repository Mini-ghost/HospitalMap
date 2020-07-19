<template>
  <div class="map" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import mapboxgl from 'mapbox-gl'

import { vetModule } from '@/store'

const POINT_NAME = 'point'

mapboxgl.accessToken = process.env.VUE_APP_MAP_TOKEN

@Component<TheMapBox>({
  name: 'TheMapBox',
  mounted() {
    const loadImageCallback = (error: Error, image: ImageData) => {
      if (error) throw error
      this._map.addImage(POINT_NAME, image)
    }

    // 初始化 MapBox GL js
    this._map = new mapboxgl.Map({
      container: this.$el,
      style: 'mapbox://styles/mapbox/streets-v11',
      // 預設中心定位座標：台中火車站座標
      center: [120.6855716, 24.1372617],
      zoom: 14
    })

    this._map.loadImage(
      'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
      loadImageCallback
    )
    this.mapAddEventListener()
  }
})
export default class TheMapBox extends Vue {
  private _map!: mapboxgl.Map

  $el!: HTMLElement

  get source () {
    const features = vetModule.vetData
      .map(item => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: item.coordinates },
        properties: { id: item.name, icon: POINT_NAME }
      }))

    return {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
      cluster: true,
      clusterRadius: 15
    }
  }

  mapAddEventListener (): void {
    this._map
      .on('load', this.onLoad)
      .on('click', this.onClick)
      .on('mouseenter', POINT_NAME, this.onMouseEnterLayer)
      .on('mouseleave', POINT_NAME, this.onMouseLeaveLayer)
  }

  onLoad () {
    this.mapAddLayer()
    this.getGeolocation()
      .then(({ type, center }) => {
        if(!type) return
        this._map.setCenter(center)
      })
  }

  onClick ({ point }: mapboxgl.MapMouseEvent): void {
    const features = this._map.queryRenderedFeatures(
      point, 
      { layers: [POINT_NAME] }
    )
    if(features.length) {
      // 動物醫院 id
      const { id } = features[0].properties as {[key: string]: string}
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

  mapAddLayer (): void {
    this._map.addLayer({
      id: POINT_NAME,
      type: 'symbol',
      source: this.source as mapboxgl.GeoJSONSourceRaw,
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
            type: false,
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
