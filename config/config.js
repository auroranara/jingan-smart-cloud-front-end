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
        {
          path: '/fire-control',
          icon: 'dashboard',
          name: 'fireControl',
          routes: [
            {
              path: '/fire-control/contract',
              name: 'contract',
              hideChildren: true,
              routes: [
                {
                  path: '/fire-control/contract',
                  redirect: '/fire-control/contract/list',
                },
                {
                  path: '/fire-control/contract/list',
                  name: 'list',
                  component: './FireControl/Contract/ContractList',
                },
                {
                  path: '/fire-control/contract/add',
                  name: 'add',
                  component: './FireControl/Contract/ContractHandler',
                },
                {
                  path: '/fire-control/contract/edit/:id',
                  name: 'edit',
                  component: './FireControl/Contract/ContractHandler',
                },
                {
                  path: '/fire-control/contract/detail/:id',
                  name: 'detail',
                  component: './FireControl/Contract/ContractDetail',
                },
              ],
            },
            {
              path: '/fire-control/user-transmission-device',
              name: 'userTransmissionDevice',
              hideChildren: true,
              routes: [
                { path: '/fire-control/user-transmission-device', name: 'userTransmissionDevice', redirect: '/fire-control/user-transmission-device/list' },
                { path: '/fire-control/user-transmission-device/list', name: 'list', component: './FireControl/UserTransmissionDevice/UserTransmissionDevice' },
                { path: '/fire-control/user-transmission-device/:companyId/detail', name: 'deviceDetail', component: './FireControl/UserTransmissionDevice/UserTransmissionDeviceDetail' },
                { path: '/fire-control/user-transmission-device/:companyId/import-point-position/:hostId', name: 'importPointPosition', component: './FireControl/UserTransmissionDevice/ImportPointPosition' },
              ],
            },
          ],
        },
        // forms
        {
          path: '/form',
          icon: 'form',
          name: 'form',
          routes: [
            { path: '/form/basic-form', name: 'basicform', component: './Forms/BasicForm' },
            {
              path: '/form/step-form',
              name: 'stepform',
              component: './Forms/StepForm',
              hideChildren: true,
              routes: [
                { path: '/form/step-form', name: 'stepform', redirect: '/form/step-form/info' },
                { path: '/form/step-form/info', name: 'info', component: './Forms/StepForm/Step1' },
                {
                  path: '/form/step-form/confirm',
                  name: 'confirm',
                  component: './Forms/StepForm/Step2',
                },
                {
                  path: '/form/step-form/result',
                  name: 'result',
                  component: './Forms/StepForm/Step3',
                },
              ],
            },
            {
              path: '/form/advanced-form',
              name: 'advancedform',
              component: './Forms/AdvancedForm',
            },
          ],
        },
        // list
        {
          path: '/list',
          icon: 'table',
          name: 'list',
          routes: [
            { path: '/list/table-list', name: 'searchtable', component: './List/TableList' },
            { path: '/list/basic-list', name: 'basiclist', component: './List/BasicList' },
            { path: '/list/card-list', name: 'cardlist', component: './List/CardList' },
            {
              path: '/list/search',
              name: 'searchlist',
              component: './List/List',
              routes: [
                { path: '/list/search/articles', name: 'articles', component: './List/Articles' },
                { path: '/list/search/projects', name: 'projects', component: './List/Projects' },
                {
                  path: '/list/search/applications',
                  name: 'applications',
                  component: './List/Applications',
                },
              ],
            },
          ],
        },
        {
          path: '/profile',
          name: 'profile',
          icon: 'profile',
          routes: [
            // profile
            { path: '/profile/basic', name: 'basic', component: './Profile/BasicProfile' },
            { path: '/profile/advanced', name: 'advanced', component: './Profile/AdvancedProfile' },
          ],
        },
        {
          name: 'result',
          icon: 'check-circle-o',
          path: '/result',
          routes: [
            // result
            { path: '/result/success', name: 'success', component: './Result/Success' },
            { path: '/result/fail', name: 'fail', component: './Result/Error' },
          ],
        },
        {
          name: 'exception',
          icon: 'warning',
          path: '/exception',
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
