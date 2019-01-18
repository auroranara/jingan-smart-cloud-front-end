// import './polyfill';
import 'moment/locale/zh-cn';
import Config from '../config/project.config';

// Performance({
//   domain: 'http://192.168.10.68:8001/api/v1/report/web',
//   add: {
//     appId: '79720FCD3AB10086CF5BE21BFE14C12C',
//   },
// });

const PROJECT_ENV = process.env.PROJECT_ENV || 'default';
const config = new Config(PROJECT_ENV);
global.PROJECT_CONFIG = config.toValue();
// console.log('PROJECT_ENV', global.PROJECT_CONFIG);
// console.log('window.publicPath', window.publicPath);
