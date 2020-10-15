/*
 * @Author: jinxiaodong
 * @Date: 2019-11-15 16:38:55
 * @LastEditors  : jinxiaodong
 * @LastEditTime : 2019-12-21 17:01:30
 * @Description: 定义接口
 */
export interface IArticleData {
  status: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  date: string;
  thumbnail: string;
  starStatus: number;
  category: string;
}

export interface INavData {
  title: string;
  summary: string;
  logo: string;
  url: string;
  category: string;
}

export interface ICategoryData {
  _id: string;
  name: string;
  icon: string;
  label: string;
}

export interface ITagData {
  name: string;
  _id: string;
}

export interface IRoleData {
  key: string;
  name: string;
  description: string;
  routes: any;
}

export interface ITransactionData {
  orderId: string;
  timestamp: string | number;
  username: string;
  price: number;
  status: string;
}

export interface IUserData {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  introduction: string;
  roles: string[];
}
