import request from '@/utils/request'

export function getShopList(data) {
  return request({
    url: '/api/order/getShopOrder',
    method: 'post',
    data
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