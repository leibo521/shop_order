import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

// /api/ccc/company/user/recharge/{id}/{money} 账户充值


export function logout() {
  return request({
    url: '/api/cu/company/logout',
    method: 'get'
  })
}

export function register(data){
  // 
  return request({
    url: '/api/register/registerUser',
    method: 'post',
    data
  })
}