//import logo from '../src/assets/logo_jingan.svg';
import code from '@/assets/jingan_download_code.png';

const defaultConfig = {
  logo: 'http://data.jingan-china.cn/v2/logo/logo.png',
  code,
  // code: 'http://data.jingan-china.cn/v2/logo/code.png',
  layer: 'http://data.jingan-china.cn/v2/logo/download_layer.png',
  // layer: 'http://data.jingan-china.cn/v2/login/jingan_download_layer.png',
  region: '无锡市',
  mail: 'jazh@jingan-china.cn',
  mainWeb: 'https://www.jingan-china.cn',
  blur: [
    'http://data.jingan-china.cn/v2/chem/login/1bg.png',
    'http://data.jingan-china.cn/v2/chem/login/2bg.png',
    'http://data.jingan-china.cn/v2/chem/login/3bg.png',
    'http://data.jingan-china.cn/v2/chem/login/5bg.png',
  ],
  focus: [
    'http://data.jingan-china.cn/v2/chem/login/1.png',
    'http://data.jingan-china.cn/v2/chem/login/2.png',
    'http://data.jingan-china.cn/v2/chem/login/3.png',
    'http://data.jingan-china.cn/v2/chem/login/5.png',
  ],
  projectKey: 'v2_test',
  projectShortName: '五位一体信息化管理平台',
  servicePhone: '400-928-5656',
  serviceSupport: '无锡晶安智慧科技有限公司',
  webscoketHost: '47.99.76.214:10036',
  location: {
    x: 120.401163,
    y: 31.560116,
    zoom: 13,
  },
};

const configs = {
  default: {
    unitName: '无锡晶安智慧科技有限公司',
  },
  demo: {
    projectKey: 'demo_pro',
  },
  five: {
    projectKey: 'huagong_pro',
  },
};

export default class Config {
  constructor(env) {
    this.config = { ...defaultConfig, ...configs[env] };
    this.config.projectName = `${this.config.projectShortName}`;
    // switch (env) {
    //   case 'default':
    //     this.config.projectName += '（测试）';
    //     this.config.projectShortName += '测试';
    //     break;
    //   case 'show':
    //     this.config.projectName += '（演示）';
    //     this.config.projectShortName += '演示';
    //     break;
    //   default:
    //     break;
    // }
  }
  toValue() {
    return this.config;
  }
}
