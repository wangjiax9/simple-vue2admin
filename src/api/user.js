import request from '@/utils/request'

export function getUserInfo(uid) {
  return request({
    url: '/new/users/' + uid,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
