import type { RouteRecord } from 'vue-router';
export const USER_CENTER_ROUTE: RouteRecord = {
  path: '/account',
  name: 'Account',
  redirect: '/account/center',
  // @ts-ignore
  component: () => import('@/layout/BasicLayoutPage.vue'),
  meta: {
    title: '个人中心',
    hideInMenu: true,
  },
  children: [
    {
      path: '/account/center',
      name: 'account/center',
      meta: {
        title: '基本设置',
        icon: '',
        hideInMenu: false,
      },
      component: () => import('@/views/account/center/index.vue'),
    },
  ],
};

export const LOGIN_ROUTE: RouteRecord = {
  path: '/login',
  name: 'Login',
  // @ts-ignore
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录页',
  },
};

export const NOT_FIND_ROUTE: RouteRecord = {
  path: '/:pathMatch(.*)',
  name: 'error',
  // @ts-ignore
  component: () => import('@/views/Error/404.vue'),
  meta: {
    title: '404',
  },
};

export const INIT_HOME: RouteRecord = {
  path: '/init-home',
  name: 'init-home',
  // @ts-ignore
  component: () => import('@/views/init-home/index.vue'),
  meta: {
    title: '初始化',
  },
};
