/*
 * @Descripttion: 地图路由
 * @version:
 * @Author: jinxiaodong
 * @Date: 2019-12-21 10:24:59
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2020-03-20 08:33:18
 */
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const mapRouter: RouteConfig = {
  path: '/map',
  component: Layout,
  redirect: 'noredirect',
  name: 'map',
  meta: {
    title: 'map',
    icon: 'map'
  },
  children: [
    {
      path: 'app',
      component: () => import('@/views/map/app.vue'),
      name: 'mapApp',
      meta: {
        title: 'mapApp',
        noCache: true
      }
    },
    {
      path: 'config',
      component: () => import('@/views/map/config.vue'),
      name: 'mapConfig',
      meta: {
        title: 'mapConfig',
        noCache: true
      }
    }
  ]
}

export default mapRouter
