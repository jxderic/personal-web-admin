<!--
 * @Author: jinxiaodong
 * @Date: 2019-11-22 14:06:20
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2019-11-22 14:43:28
 * @Description: 
 -->
<template>
  <nav-detail :is-edit="true" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavDetail from './components/NavDetail.vue'

@Component({
  name: 'EditNav',
  components: {
    NavDetail
  }
})
export default class extends Vue {}
</script>
