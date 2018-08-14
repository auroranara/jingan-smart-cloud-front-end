import './polyfill';
import 'moment/locale/zh-cn';
import configs from '../config/project.config';

const PROJECT_ENV = process.env.PROJECT_ENV || 'default';

global.PROJECT_CONFIG = configs[PROJECT_ENV] || {};

console.log(global.PROJECT_CONFIG);
