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
        // baseInfo
        { path: '/', redirect: '/base-info/company/list' },
        {
          path: '/base-info',
          name: 'baseInfo',
          icon: 'dashboard',
          routes: [
            {
              path: '/base-info/company',
              name: 'company',
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
          ],
        },
        // dynamicMonitoring
        {
          path: '/dynamic-monitoring',
          icon: 'dashboard',
          name: 'dynamicMonitoring',
          routes: [
            {
              path: '/dynamic-monitoring/fire-alarm',
              name: 'fireAlarm',
              hideChildren: true,
              routes: [
                { path: '/dynamic-monitoring/fire-alarm', name: 'fireAlarm', redirect: '/dynamic-monitoring/fire-alarm/index' },
                { path: '/dynamic-monitoring/fire-alarm/index', name: 'index', component: './DynamicMonitoring/FireAlarm/index' },
                { path: '/dynamic-monitoring/fire-alarm/company/:companyId', name: 'companyDetail', component: './DynamicMonitoring/FireAlarm/CompanyDetail' },
                // { path: '/fire-alarm/company/detail/:companyId/:detailId', name: 'alarmDetail', component: './DynamicMonitoring/FireAlarm/FireAlarmDetail' },
              ],
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
