// import './polyfill';
import 'moment/locale/zh-cn';
import configs from '../config/project.config';
// import Performance from 'web-report';

// Performance({
//   domain: 'http://192.168.14.59:7001/api/v1/report/web',
//   add: {
//     appId: '111376904C634F3BC778E8E9E22488DB',
//   },
// });

const PROJECT_ENV = process.env.PROJECT_ENV || 'default';
global.PROJECT_CONFIG = configs[PROJECT_ENV] || {};

// console.log('PROJECT_ENV', PROJECT_ENV);
// console.log('window.publicPath', window.publicPath);
