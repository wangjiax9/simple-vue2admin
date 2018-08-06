import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/404', component: _import('errorpage/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard',
        noCache: true
      }
    }]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: 'noredirect',
    name: 'resource',
    meta: {
      title: '资源位管理',
      icon: 'example'
    },
    children: [
      {
        path: '/resource/periodical',
        name: 'periodical',
        component: _import('periodical/index'),
        redirect: '/resource/periodical/periodicals',
        meta: {
          title: '先锋内刊管理',
          icon: 'example'
        },
        children: [
          {
            path: 'periodicals',
            name: 'periodicals',
            component: _import('periodical/PeriodicalList'),
            meta: {
              title: '先锋内刊管理',
              icon: 'example'
            }
          },
          {
            path: 'periodical-edit/:id',
            name: 'periodical-edit',
            component: _import('periodical/PeriodicalEdit'),
            hidden: true,
            meta: {
              title: '先锋内刊编辑',
              icon: 'example'
            }
          }
        ]
      },
      {
        path: '/resource/activity',
        name: 'activity',
        component: _import('activity/index'),
        redirect: '/resource/activity/Promotions',
        hidden: true,
        meta: {
          title: '活动管理',
          icon: 'example'
        },
        children: [
          {
            path: 'promotions',
            name: 'promotions',
            component: _import('activity/Promotions'),
            meta: {
              title: '活动管理',
              icon: 'example'
            }
          },
          {
            path: 'promotions-edit/:id',
            name: 'promotions-edit',
            component: _import('activity/PromotionsEdit'),
            hidden: true,
            meta: {
              title: '活动管理配置',
              icon: 'example'
            }
          }
        ]
      },
      {
        path: '/resource/launch',
        name: 'launch',
        component: _import('launch/index'),
        redirect: '/resource/launch/Startpages',
        hidden: true,
        meta: {
          title: '启动页管理',
          icon: 'example'
        },
        children: [
          {
            path: 'startpages',
            name: 'startpages',
            component: _import('launch/Startpages'),
            meta: {
              title: '启动页管理',
              icon: 'example'
            }
          },
          {
            path: 'startpages-edit/:id',
            name: 'startpages-edit',
            component: _import('launch/StartpagesEdit'),
            hidden: true,
            meta: {
              title: '启动页管理配置',
              icon: 'example'
            }
          }
        ]
      },
      {
        path: '/resource/daily',
        name: 'daily',
        component: _import('dailySignIn/index'),
        redirect: '/resource/daily/daily-sign-in',
        meta: {
          title: '日签管理',
          icon: 'example'
        },
        children: [
          {
            path: 'daily-sign-in',
            name: 'daily-sign-in',
            component: _import('dailySignIn/DailySignInList'),
            meta: {
              title: '日签管理',
              icon: 'example'
            }
          },
          {
            path: 'daily-sign-in-edit/:id',
            name: 'daily-sign-in-edit',
            component: _import('dailySignIn/DailySignInEdit'),
            hidden: true,
            meta: {
              title: '日签编辑',
              icon: 'example'
            }
          }
        ]
      },
      {
        path: '/resource/lottery',
        name: 'lottery',
        component: _import('lottery/index'),
        redirect: '/resource/lottery/lottery-list',
        meta: {
          title: '抽奖管理',
          icon: 'example'
        },
        children: [
          {
            path: 'lottery-list',
            name: 'lottery-list',
            component: _import('lottery/LotteryList'),
            meta: {
              title: '抽奖管理',
              icon: 'example'
            }
          },
          {
            path: 'lottery-edit/:id',
            name: 'lottery-edit',
            component: _import('lottery/LotteryEdit'),
            hidden: true,
            meta: {
              title: '抽奖编辑',
              icon: 'example'
            }
          }
        ]
      },
      {
        path: 'feeds',
        name: 'feeds',
        component: _import('feeds/index'),
        meta: {
          title: '推荐流管理',
          icon: 'example'
        }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: 'noredirect',
    name: 'users',
    meta: {
      title: '用户相关',
      icon: 'example'
    },
    children: [
      {
        path: '/users/identity',
        name: 'identity',
        component: _import('identity/index'),
        redirect: '/users/identity/identity-type',
        meta: {
          title: '身份管理',
          icon: 'example'
        },
        children: [
          {
            path: 'identity-type',
            name: 'identity-type',
            component: _import('identity/IdentityList'),
            meta: {
              title: '身份管理',
              icon: 'example'
            }
          },
          {
            path: 'identity-user',
            name: 'identity-user',
            component: _import('identity/UserIdentityList'),
            hidden: true,
            meta: {
              title: '身份用户管理',
              icon: 'example'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: 'noredirect',
    name: 'shop',
    hidden: true,
    meta: {
      title: '商城',
      icon: 'example'
    },
    children: [
      {
        path: '/shop/products',
        name: 'products',
        component: _import('shop/index'),
        redirect: '/shop/products/product-list',
        meta: {
          title: '商品管理',
          icon: 'example'
        },
        children: [
          {
            path: 'product-list',
            name: 'product-list',
            component: _import('shop/ProductList'),
            meta: {
              title: '商品管理',
              icon: 'example'
            }
          },
          {
            path: 'product-edit/:id',
            name: 'product-edit',
            component: _import('shop/ProductEdit'),
            hidden: true,
            meta: {
              title: '商品详情',
              icon: 'example'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/other',
    component: Layout,
    redirect: 'noredirect',
    name: 'other',
    meta: {
      title: '其他',
      icon: 'example'
    },
    children: [
      {
        path: '/other/xcx',
        component: _import('other/index'),
        redirect: '/other/xcx-order',
        meta: {
          title: '菜单解析',
          icon: 'example'
        },
        children: [
          {
            path: 'xcx-order',
            name: 'xcxexp',
            component: _import('other/XcxOrder'),
            meta: {
              title: '菜单解析',
              icon: 'example'
            }
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

