/*
 * @Author: jinxiaodong
 * @Date: 2019-11-15 16:38:55
 * @LastEditors: jinxiaodong
 * @LastEditTime: 2019-12-03 17:25:17
 * @Description: 博客的接口
 */
import request from '@/utils/request'
import { IArticleData } from './types'

export const defaultArticleData: IArticleData = {
  status: 'draft',
  title: '',
  content: '',
  summary: '',
  tags: [],
  date: new Date() + '',
  thumbnail: '',
  starStatus: 0,
  category: ''
}

export const getArticles = (params: any) =>
  request({
    url: '/articles',
    method: 'get',
    params
  })

export const getArticle = (id: string, params: any) =>
  request({
    url: `/articles/getItem/${id}`,
    method: 'get',
    params
  })

export const createArticle = (data: any) =>
  request({
    url: '/articles',
    method: 'post',
    data
  })

export const updateArticle = (id: string, data: any) =>
  request({
    url: `/articles/${id}`,
    method: 'put',
    data
  })

export const deleteArticle = (id: string) =>
  request({
    url: `/articles/deleteItem/${id}`,
    method: 'delete'
  })

export const createTag = (data: any) =>
  request({
    url: '/articles/createTag',
    method: 'post',
    data
  })

export const updateTag = (id: string, data: any) =>
  request({
    url: `/articles/updateTag/${id}`,
    method: 'put',
    data
  })

export const getTags = () =>
  request({
    url: '/articles/tags',
    method: 'get'
  })

export const deleteTag = (id: string) =>
  request({
    url: `/articles/deleteTag/${id}`,
    method: 'delete'
  })

export const createCategory = (data: any) =>
  request({
    url: '/articles/createCategory',
    method: 'post',
    data
  })

export const updateCategory = (id: string, data: any) =>
  request({
    url: `/articles/updateCategory/${id}`,
    method: 'put',
    data
  })

export const getCategorys = () =>
  request({
    url: '/articles/categorys',
    method: 'get'
  })

export const deleteCategory = (id: string) =>
  request({
    url: `/articles/deleteCategory/${id}`,
    method: 'delete'
  })
