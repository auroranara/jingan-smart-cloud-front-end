/* eslint-disable react/destructuring-assignment */

// https://umijs.org/config/

const path = require('path');
// const pageRoutes = require('../_routes');

// const hosts = {
//   lm: '192.168.10.2', // 吕旻
//   gjm: '192.168.10.55', // 顾家铭
//   sqz: '192.168.10.56', //孙启政
//   test: '192.168.10.67:9080', // 内网
//   mock: '118.126.110.115:3001/mock/28',
// };

export default {
  proxy: {
    '/acloud_new': {
      target: 'http://192.168.10.67:9080',
      changeOrigin: true,
      pathRewrite: { '^/acloud_new': '/acloud_new' },
    },
  },
  // add for transfer to umi
  plugins: [
    'umi-plugin-dva',
    'umi-plugin-locale',
    // TODO 决定是否使用约定路由，如果使用配置路由那么 umi-plugin-routes 可以去掉了
    // [
    //   'umi-plugin-routes',
    //   {
    //     exclude: [/\.test\.js/],
    //     update(routes) {
    //       return [...pageRoutes, ...routes];
    //     },
    //   },
    // ],
  ],
  locale: {
    enable: true, // default false
    default: 'zh-CN', // default zh-CN
    baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
    antd: true, // use antd, default is true
  },
  // 路由配置
  routes: [
    // user
    {
      path: '/user',
      component: './layouts/UserLayout',
      routes: [
        { path: '/user', redirect: '/user/login' },
        { path: '/user/login', component: '/User/Login' },
        { path: '/user/register', component: './User/Register' },
        { path: '/user/register-result', component: './User/RegisterResult' },
      ],
    },
    // app
    {
      path: '/',
      component: './layouts/LoadingPage',
      routes: [
        // dashboard
        { path: '/', redirect: '/base-info/company/list' },

        {
          path: '/base-info',
          name: 'baseInfo',
          icon: 'dashboard',
          routes: [
            {
              path: '/base-info/company',
              name: 'company',
              // component: './BaseInfo/Company/CompanyList',
              hideChildren: true,
              routes: [
                {
                  path: '/base-info/company',
                  name: 'company',
                  redirect: '/base-info/company/list',
                },
                {
                  path: '/base-info/company/list',
                  name: 'list',
                  component: './BaseInfo/Company/CompanyList',
                },
                {
                  path: '/base-info/company/add',
                  name: 'add',
                  component: './BaseInfo/Company/CompanyEdit',
                },
                {
                  path: '/base-info/company/edit/:id',
                  name: 'edit',
                  component: './BaseInfo/Company/CompanyEdit',
                },
                {
                  path: '/base-info/company/detail/:id',
                  name: 'detail',
                  component: './BaseInfo/Company/CompanyDetail',
                },
              ],
            },
            // { path: '/dashboard/monitor', name: 'monitor', component: './Dashboard/Monitor' },
            // { path: '/dashboard/workplace', name: 'workplace', component: './Dashboard/Workplace' },
          ],
        },

        // FireControl
        {
          path: '/fire-control',
          name: 'fireControl',
          icon: 'table',
          routes: [
            {
              path: '/fire-control/maintenance-company',
              name: 'maintenanceCompany',
              hideChildren: true,
              routes: [
                {
                  path: '/fire-control/maintenance-company',
                  name: 'maintenanceCompany',
                  redirect: '/fire-control/maintenance-company/list',
                },
                {
                  path: '/fire-control/maintenance-company/list',
                  name: 'list',
                  component: './FireControl/MaintenanceCompany/MaintenanceCompanyList',
                },
                {
                  path: '/fire-control/maintenance-company/add',
                  name: 'add',
                  component: './FireControl/MaintenanceCompany/MaintenanceCompanyAdd',
                },
                {
                  path: '/fire-control/maintenance-company/edit/:id',
                  name: 'edit',
                  component: './FireControl/MaintenanceCompany/MaintenanceCompanyEdit',
                },
                {
                  path: '/fire-control/maintenance-company/detail/:id',
                  name: 'detail',
                  component: './FireControl/MaintenanceCompany/MaintenanceCompanyDetail',
                },
              ],
            },
          ],
        },

        // RoleAuthorization
        {
          path: '/role-authorization',
          name: 'roleAuthorization',
          icon: 'table',
          routes: [
            {
              path: '/role-authorization/account-management',
              name: 'account',
              hideChildren: true,
              routes: [
                {
                  path: '/role-authorization/account-management',
                  name: 'account',
                  redirect: '/role-authorization/account-management/list',
                },
                {
                  path: '/role-authorization/account-management/list',
                  name: 'list',
                  component: './RoleAuthorization/AccountManagement/AccountManagementList',
                },
                {
                  path: '/role-authorization/account-management/add',
                  name: 'add',
                  component: './RoleAuthorization/AccountManagement/AccountManagementAdd',
                },
                {
                  path: '/role-authorization/account-management/edit/:id',
                  name: 'edit',
                  component: './RoleAuthorization/AccountManagement/AccountManagementEdit',
                },
                {
                  path: '/role-authorization/account-management/detail/:id',
                  name: 'detail',
                  component: './RoleAuthorization/AccountManagement/AccountManagementDetail',
                },
              ],
            },
          ],
        },
        {
          name: 'exception',
          icon: 'warning',
          path: '/exception',
          hideInMenu: true,
          routes: [
            // exception
            { path: '/exception/403', name: 'not-permission', component: './Exception/403' },
            { path: '/exception/404', name: 'not-find', component: './Exception/404' },
            { path: '/exception/500', name: 'server-error', component: './Exception/500' },
            {
              path: '/exception/trigger',
              name: 'trigger',
              hideInMenu: true,
              component: './Exception/triggerException',
            },
          ],
        },
      ],
    },
  ],

  theme: {
    'card-actions-background': '#f5f8fa',
  },
  // entry: 'src/index.js', // TODO remove
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, '../src/components/'),
    utils: path.resolve(__dirname, '../src/utils/'),
    assets: path.resolve(__dirname, '../src/assets/'),
    common: path.resolve(__dirname, '../src/common/'),
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less')
      ) {
        return localName;
      }
      const antdProPath = context.resourcePath.match(/src(.*)/)[1].replace('.less', '');
      const arr = antdProPath
        .split('/')
        .map(a => a.replace(/([A-Z])/g, '-$1'))
        .map(a => a.toLowerCase());
      return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
    },
  },
  disableFastClick: true,
  hashHistory: true,
  manifest: {
    name: 'ant-design-pro',
    background_color: '#FFF',
    description: 'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },
};
