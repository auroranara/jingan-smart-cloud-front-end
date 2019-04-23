// import './polyfill';
import 'moment/locale/zh-cn';
import Config from '../config/project.config';

const PROJECT_ENV = process.env.PROJECT_ENV || 'default';
const config = new Config(PROJECT_ENV);
global.PROJECT_CONFIG = config.toValue();
global.VERSION = process.env.VERSION || '测试版'; // 没有版本号就是测试版
