import request from '@/utils/request'

export function getShopList(data) {
  return request({
    url: '/api/order/getShopOrder',
    method: 'post',
    data
  })
}


export function delData(data) {
  return request({
    url: '/api/order/deleteById',
    method: 'post',
    data
  })
}