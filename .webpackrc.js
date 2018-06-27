const path = require('path');

export default {
  entry: 'src/index.js',
<<<<<<< HEAD
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
=======
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
>>>>>>> init
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
      publicPath: '/',
    },
  },
<<<<<<< HEAD
  externals: {
    '@antv/data-set': 'DataSet',
    bizcharts: 'BizCharts',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  externals: {
    '@antv/data-set': 'DataSet',
    bizcharts: 'BizCharts',
    rollbar: 'rollbar',
  },
=======
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
>>>>>>> init
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  publicPath: '/acloud_new',
  disableDynamicImport: true,
  hash: true,
>>>>>>> init
};
