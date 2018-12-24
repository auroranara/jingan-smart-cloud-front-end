// import './polyfill';
import 'moment/locale/zh-cn';
import configs from '../config/project.config';
// import Performance from 'web-report';

// Performance({
//   domain: 'http://192.168.10.68:8001/api/v1/report/web',
//   add: {
//     appId: '79720FCD3AB10086CF5BE21BFE14C12C',
//   },
// });

const PROJECT_ENV = process.env.PROJECT_ENV || 'default';
global.PROJECT_CONFIG = configs[PROJECT_ENV] || {};

// 如果是build模式
// if (process.env.NODE_ENV === 'production') {
//   window.frontjsConfig.token = '60015f494561deeb785f3e6216d779bd';
// }

// console.log('PROJECT_ENV', PROJECT_ENV);
// console.log('window.publicPath', window.publicPath);
