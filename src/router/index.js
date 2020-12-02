import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },


  {
    path: '/institutions',
    component: Layout,
    redirect: '/institutions/stores',
    name: 'institutions',
    meta: { title: '数据统计', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'stores',
        name: 'stores',
        component: () => import('@/views/table/total'),
        meta: { title: '数据统计', icon: 'table' }
      },
 
  
    ]
  },
  {
    path: '/update',
    component: Layout,
    redirect: '/update/index',
    name: 'update',
    meta: { title: '超时限', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'updateIndex',
        component: () => import('@/views/table/updateTime'),
        meta: { title: '超时限', icon: 'table' }
      },
 
  
    ]
  },
  {
    path: '/mange',
    component: Layout,
    redirect: '/mange/data',
    name: 'mange',
    meta: { title: '数据管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'data',
        name: 'data',
        component: () => import('@/views/table/index'),
        meta: { title: '数据管理', icon: 'table' }
      },
 
  
    ]
  },
  {
    path: '/out',
    component: Layout,
    redirect: '/out/index',
    name: 'institutions',
    meta: { title: '出入库日志', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'outIndex',
        component: () => import('@/views/table/clues'),
        meta: { title: '出入库日志', icon: 'table' }
      },
 
  
    ]
  },
  {
    path: '/net',
    component: Layout,
    redirect: '/net/index',
    name: 'netIndex',
    meta: { title: '网点管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'netMange',
        component: () => import('@/views/table/business'),
        meta: { title: '网点管理', icon: 'table' }
      }
  
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'institutions',
    meta: { title: '用户管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'userIndex',
        component: () => import('@/views/table/costumers'),
        meta: { title: '用户管理', icon: 'table' }
      },
 
  
    ]
  },
  {
    path: '/company',
    component: Layout,
    redirect: '/company/index',
    name: 'company',
    meta: { title: '快递管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'companyIndex',
        component: () => import('@/views/company/index'),
        meta: { title: '快递管理', icon: 'table' }
      },
 
  
    ]
  },
  {
    path: '/logg',
    component: Layout,
    redirect: '/logg/index',
    name: 'loogIndex',
    meta: { title: '操作日志管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'logIndex',
        component: () => import('@/views/table/logger'),
        meta: { title: '操作日志管理', icon: 'table' }
      }
    ]
  },
 


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
