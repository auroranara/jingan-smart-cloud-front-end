import wpkReporter from 'wpk-reporter'; // 导入基础sdk
import 'moment/locale/zh-cn';
import Config from '../config/project.config';

const PROJECT_ENV = process.env.PROJECT_ENV || 'default';
const config = new Config(PROJECT_ENV);
global.PROJECT_CONFIG = config.toValue();
global.VERSION = process.env.VERSION;

const __wpk = new wpkReporter({
  bid: '4x9zhwir-0q09zenh', // 新建应用时确定
  spa: true, // 单页应用开启后，可更准确地采集PV
  uid: '', // 支持函数，需返回最终的uid字符串
  rel: global.VERSION, // 支持函数，需返回最终的版本字符串
  plugins: [],
});

__wpk.installAll(); // 初始化sdk 必须调用
