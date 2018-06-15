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
  publicPath: '/',
<<<<<<< HEAD
  hash: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (context.resourcePath.includes('node_modules')) {
        return localName;
      }

      let antdProPath = context.resourcePath.match(/src(.*)/)[1].replace('.less', '');
      if (context.resourcePath.includes('components')) {
        antdProPath = antdProPath.replace('components/', '');
      }
      const arr = antdProPath
        .split('/')
        .map(a => a.replace(/([A-Z])/g, '-$1'))
        .map(a => a.toLowerCase());
      return `antd-pro${arr.join('-')}-${localName}`.replace('--', '-');
    },
  },
=======
  disableDynamicImport: true,
  hash: true,
>>>>>>> init
};
