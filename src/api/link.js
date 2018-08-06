function getOrigin() {
  let origin = ''
  const host = location.host
  // 测试环境和开发环境
  if (host === '106.2.39.174:8081' || process.env.NODE_ENV === 'development') {
    origin = location.origin
  } else if (host === '106.2.66.192:8000') {  // 线上环境
    origin = 'https://ypw.163.com'
  }
  return origin
}
// 期刊地址
export function toPeriodical(id) {
  return `${getOrigin()}/chook/periodical/periodical.html#/periodical/${id}`
}
// 帖子详情页地址
export function toPost(id) {
  return `${getOrigin()}/evolution/pages/thread.html?ptype=1&pid=${id}`
}
// 帖子详情页地址
export function toGame(id) {
  return `${getOrigin()}/w/games/${id}`
}
// 身份介绍页地址
export function toIdentity() {
  return `${getOrigin()}/chook/ypw/ypw.html#/identity`
}

