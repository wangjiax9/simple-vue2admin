import request from '@/utils/request'

export function getComment(cid) {
  return request({
    url: '/new/comments/' + cid,
    method: 'get'
  })
}
