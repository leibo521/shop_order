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

//获取用户列表
export function getCostumer(data) {
  return request({
    url: '/api/costumer/getCostumer',
    method: 'post',
    data
  })
}

//添加用户
export function addCostumer(data) {
  return request({
    url: '/api/costumer/addCostumer',
    method: 'post',
    data
  })
}

//删除用户
export function delCostumer(data) {
  return request({
    url: '/api/costumer/delCostumer',
    method: 'post',
    data
  })
}

//删除用户
export function updateCostumer(data) {
  return request({
    url: '/api/costumer/updateCostumer',
    method: 'post',
    data
  })
}

// 添加网点
export function addBusiness(data) {
  return request({
    url: '/api/business/add',
    method: 'post',
    data
  })
}

// 删除网点
export function delBusiness(data) {
  return request({
    url: '/api/business/delete',
    method: 'post',
    data
  })
}

// 修改网点
export function updateBusiness(data) {
  return request({
    url: '/api/business/update',
    method: 'post',
    data
  })
}

// 查询网点
export function getBusiness(data) {
  return request({
    url: '/api/business/select',
    method: 'post',
    data
  })
}


// 查询操作日志
export function getLogger(data) {
  return request({
    url: '/api/logger/getLogger',
    method: 'post',
    data
  })
}

// --- 出库的接口
export function outputByAdmin(data) {
  return request({
    url: '/api/orderIO/outputByAdmin',
    method: 'post',
    data
  })
}
///api/statistics/adminGetDataStatistics

export function getTotalData(data) {
  return request({
    url: '/api/statistics/adminGetDataStatistics',
    method: 'post',
    data
  })
}
// /api/statistics/adminGetDataStatisticsToday
export function getTodayData(data) {
  return request({
    url: '/api/statistics/adminGetDataStatisticsToday',
    method: 'post',
    data
  })
}


/**快递管理
 * /api/company/addCompany
 * /api/company/delCompany
 * // /api/company/getCompanys
 */

export function getCompanys(data) {
  return request({
    url: '/api/company/getCompanys',
    method: 'post',
    data
  })
}
export function delCompany(data) {
  return request({
    url: '/api/company/delCompany',
    method: 'post',
    data
  })
}
export function addCompany(data) {
  return request({
    url: '/api/company/addCompany',
    method: 'post',
    data
  })
}
