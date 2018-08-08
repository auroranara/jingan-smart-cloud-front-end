/* eslint-disable react/destructuring-assignment */

// https://umijs.org/config/

const path = require('path');
const pageRoutes = require('./router.config');

const hosts = {
  lm: '192.168.10.2', // 吕旻
  gjm: '192.168.10.55', // 顾家铭
  ct: '192.168.10.8', //孙启政
  sqz: '192.168.10.56', //孙启政
  dev: '192.168.10.68:18080', // 开发
  test: '192.168.10.68:18082', // 测试
  mock: '118.126.110.115:3001/mock/28',
  jb: '192.168.10.3', // 杰宝
  gj: '192.168.10.9', //高进
};

export default {
  proxy: {
    '/acloud_new': {
      // target: `http://${hosts.jb}`,
      target: `http://${hosts.gj}`,
      // target: `http://${hosts.dev}`,
      target: `http://${hosts.test}`,
      changeOrigin: true,
      pathRewrite: { '^/acloud_new': '/acloud_new' },
    },
    '/mock': {
      target: `http://${hosts.mock}`,
      changeOrigin: true,
      pathRewrite: { '^/mock': '/mock' },
    },
    '/gsafe': {
      target: `http://${hosts.test}`,
      changeOrigin: true,
      pathRewrite: { '^/gsafe': '/gsafe' },
    },
    // '/eye': {
    //   target: 'http://192.168.10.2',
    //   changeOrigin: true,
    //   pathRewrite: { '^/eye': '/eye' },
    // },
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
  routes: pageRoutes,

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
    name: 'jing-an-smart-cloud',
    background_color: '#FFF',
    description: 'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/acloud_new/static/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },
};
