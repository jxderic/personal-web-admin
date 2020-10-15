/*
 * @Author: jinxiaodong
 * @Date: 2019-11-15 16:38:55
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2019-11-26 17:19:43
 * @Description: 导航的接口
 */
import request from '@/utils/request'
import { INavData } from './types'

export const defaultNavData: INavData = {
  title: '',
  summary: '',
  logo: '',
  url: '',
  category: ''
}

export const getNavs = (params: any) =>
  request({
    url: '/nav',
    method: 'get',
    params
  })

export const getNav = (id: string, params: any) =>
  request({
    url: `/nav/getNavItem/${id}`,
    method: 'get',
    params
  })

export const createNav = (data: any) =>
  request({
    url: '/nav',
    method: 'post',
    data
  })

export const updateNav = (id: string, data: any) =>
  request({
    url: `/nav/${id}`,
    method: 'put',
    data
  })

export const deleteNav = (id: string) =>
  request({
    url: `/nav/${id}`,
    method: 'delete'
  })

export const createCategory = (data: any) =>
  request({
    url: '/nav/createCategory',
    method: 'post',
    data
  })

export const getCategorys = () =>
  request({
    url: `/nav/getCategorys`,
    method: 'get'
  })

export const deleteCategory = (id: string) =>
  request({
    url: `/nav/deleteCategory/${id}`,
    method: 'delete'
  })

export const updateCategory = (id: string, data: any) =>
  request({
    url: `/nav/updateCategory/${id}`,
    method: 'put',
    data
  })
