<!--
 * @Descripttion: 
 * @Author: jinxiaodong
 * @Date: 2020-10-15 14:25:10
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2020-10-24 11:30:33
-->

<template>
  <div id="app">
    <router-view />
    <service-worker-update-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {}
</script>
