<!--
 * @Author: jinxiaodong
 * @Date: 2019-11-22 14:06:20
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2019-11-22 14:43:36
 * @Description: 
 -->
<template>
  <nav-detail :is-edit="false" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavDetail from './components/NavDetail.vue'

@Component({
  name: 'CreateNav',
  components: {
    NavDetail
  }
})
export default class extends Vue {}
</script>
