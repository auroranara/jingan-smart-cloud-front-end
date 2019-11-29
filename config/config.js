/* eslint-disable react/destructuring-assignment */

// https://umijs.org/config/
import os from 'os';
const path = require('path');
const initRouters = require('./router.config');
const webpackplugin = require('./plugin.config');
const generateName = require('./name.config');
let version = '';
process.argv.forEach(p => {
  if (p.indexOf('version=') > -1) {
    version = p.split('=')[1];
  }
});
// --TODO:根据环境变量生成项目名称
const PROJECT_ENV = process.env.PROJECT_ENV || 'default';
const projectShortName = generateName(PROJECT_ENV);

const hosts = {
  lm: '192.168.10.2', // 吕旻
  lm1: '192.168.14.241:8080',
  sj: '192.168.10.3', // 沈杰
  gjm: '192.168.10.55', // 顾家铭
  ct: '192.168.10.29:8080', //陈涛
  sqz: '192.168.10.56', //孙启政
  dev: '192.168.10.68:18081', // 开发
  test: 'test.jinganyun.net', // 测试
  pro: '192.168.10.68:18083', // 测试
  mock: '118.126.110.115:3001/mock/28',
  jb: '192.168.10.3', // 杰宝
  gj: '192.168.10.9', //高进
  tw: '192.168.10.5', // 田伟
  cfm: '192.168.10.6', // 崔富民
  tg: '192.168.14.230:8080', // 汤归
  jiangxi: '58.215.178.100:12083',
  xuzhou: 'xuzhou.jinganyun.net',
  shanxi: '58.215.178.100:12085',
  nanxiao: '58.215.178.100:12084',
  sk: '192.168.10.21',
  ly: '192.168.10.19:8080',
  show: 'www.jinganyun.net',
};

export default {
  proxy: {
    '/acloud_new': {
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
  },
  // add for transfer to umi
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        title: {
          defaultTitle: projectShortName || '晶安智慧云',
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: true,
        ...(os.platform() === 'darwin'
          ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: false,
          }
          : {}),
      },
    ],
  ],

  // 路由配置
  routes: initRouters(process.env.PROJECT_ENV),
  history: 'hash',
  hash: true,
  targets: {
    ie: 11,
  },
  // 如果是演示环境 publicPath目录为xshow
  // 如果是泸州环境由于没有ip使用acloud_new
  // 后期改成switch
  publicPath:
    process.env.PROJECT_ENV === 'show'
      ? '/xshow/'
      : process.env.PROJECT_ENV === 'fire'
        ? '/acloud_new/'
        : '/',
  // publicPath: '/acloud_new/',
  theme: {
    'card-actions-background': '#f5f8fa',
  },
  runtimePublicPath: true,
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
      // const antdProPath = context.resourcePath.match(/src(.*)/)[1].replace('.less', '');
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      } else {
        return localName;
      }
    },
  },
  define: {
    'process.env.PROJECT_ENV': process.env.PROJECT_ENV || 'default',
    'process.env.VERSION': version,
  },
  manifest: {
    name: 'jing-an-smart-cloud',
    background_color: '#FFF',
    description: '',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/static/favicon.png',
        // src: '/acloud_new/static/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },
  chainWebpack: webpackplugin,
  cssnano: {
    mergeRules: false,
  },
};
