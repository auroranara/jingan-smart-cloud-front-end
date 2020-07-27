//import logo from '../src/assets/logo_jingan.svg';
import code from '@/assets/jingan_download_code.png';
import demoCode from '@/assets/jingan_download_demo_code.png';

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
  ios: 'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/chemicalAppDownload/OfficialAPP/official_version/ChemicalCloud.plist&ran=',
  android: 'http://five.jinganyun.net/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
};

const configs = {
  default: {
    unitName: '无锡晶安智慧科技有限公司',
  },
  demo: {
    projectKey: 'demo_pro',
    code: demoCode,
    ios: 'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/chemicalAppDownload/DemoAPP/official_version/DemoChemicalCloud.plist&ran=',
    android: 'http://demo.jinganyun.net/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  five: {
    projectKey: 'huagong_pro',
    code: 'http://data.jingan-china.cn/v2/login/code/five_code.png',
    ios: 'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/chemicalAppDownload/OfficialAPP/official_version/ChemicalCloud.plist&ran=',
    android: 'http://five.jinganyun.net/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  cmw: {
    projectKey: 'cmw_pro',
    code: 'http://data.jingan-china.cn/v2/login/code/cmw_code.png',
    ios: 'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/chemicalAppDownload/KXBHAPP/official_version/KXBHChemicalCloud.plist&ran=',
    android: 'http://cmw.jinganyun.net/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  quechen: {
    projectKey: 'huagong_pro',
    code: 'http://data.jingan-china.cn/v2/login/code/quechen_code.png',
    ios: 'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/chemicalAppDownload/QueChenAPP/official_version/QueChenChemicalCloud.plist&ran=',
    android: 'http://hse.quechen.com/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
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
