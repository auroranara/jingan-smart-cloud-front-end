// import './polyfill';
import 'moment/locale/zh-cn';
import configs from '../config/project.config';
import Performance from 'web-report';

Performance({
  domain: 'http://192.168.10.68:8001/api/v1/report/web',
  add: {
    appId: '79720FCD3AB10086CF5BE21BFE14C12C',
  },
});

const PROJECT_ENV = process.env.PROJECT_ENV || 'default';
global.PROJECT_CONFIG = configs[PROJECT_ENV] || {};

// console.log('PROJECT_ENV', PROJECT_ENV);
// console.log('window.publicPath', window.publicPath);
