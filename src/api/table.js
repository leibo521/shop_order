import request from '@/utils/request'

export function getShopList(data) {
  return request({
    url: '/api/order/getShopOrder',
    method: 'post',
    data
  })
}

export function addShopList(data) {
  return request({
    url: '/api/order/add',
    method: 'post',
    data
  })
}
// /api/logger/getIoLogger
export function getIoLogger(data) {
  return request({
    url: '/api/logger/getIoLogger',
    method: 'get',
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
    params:data
  })
}
//数据管理删除
export function delData(data) {
  return request({
    url: '/api/order/deleteById',
    method: 'post',
    data
  })
}