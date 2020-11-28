import request from '@/utils/request'

export function getShopList(data) {
  return request({
    url: '/api/order/getShopOrder',
    method: 'post',
    data
  })
}


