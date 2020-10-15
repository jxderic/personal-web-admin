<!--
 * @Descripttion: 地图应用
 * @version:
 * @Author: jinxiaodong
 * @Date: 2020-03-20 08:18:09
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2020-04-12 12:40:19
 -->
<template>
  <div class="mapApp-container">
    <div
      ref="rootMap"
      class="map-container"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import 'ol/ol.css'
import Tile from 'ol/layer/Tile'
import Map from 'ol/Map'
import View from 'ol/View'
import XYZ from 'ol/source/XYZ'
import Vector from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import Point from 'ol/geom/Point'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import { transform } from 'ol/proj'

@Component({
  name: 'MapApp',
  components: {

  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) private coor!: number[]
  private map: any
  private vec: any

  mounted() {
    this.$nextTick(() => {
      this.initMap()
      console.log(this.map)
      this.initLayer()
    })
  }

  private initMap() {
    const tileLayer = new Tile({
      source: new XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
      })
    })
    const mapContainer = this.$refs.rootMap
    this.map = new Map({
      target: mapContainer as HTMLElement,
      layers: [tileLayer],
      view: new View({
        center: transform([120, 30], 'EPSG:4326', 'EPSG:3857'),
        zoom: 9,
        projection: 'EPSG:3857'
      })
    })
  }
  private initLayer() {
    this.vec = new Vector({
      source: new VectorSource(),
      style: new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({
            color: 'yellow'
          }),
          stroke: new Stroke({
            width: 2,
            color: 'red'
          })
        })
      })
    })
    this.map.addLayer(this.vec)
  }
}
</script>
<style lang="scss" scoped>
.mapApp-container {
  width: 100%;
  height: 100%;
}
.map-container {
  width: 100%;
  height: 100%;
}
</style>
