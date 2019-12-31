import logo from '../src/assets/logo_jingan.svg';
import fireLogo from '../src/assets/fire_logo.svg';
import code from '../src/assets/jingan_download_code.png';
import czeyLogo from '../src/assets/logo_czey.svg';
import nanxiaoLogo from '../src/assets/logo_nanxiao.svg';
import nanxiaoCode from '../src/assets/nanxiao_download_code.png';
import liminLogo from '../src/assets/logo_limin.svg';
// import liminCode from '../src/assets/limin_download_code.jpg';
// import changshuCode from '../src/assets/changshu_download_code.png';
import shanxiCode from '../src/assets/shanxi_download_code.png';
// import fireCode from '../src/assets/fire_download_code.jpg';
import yanshiCode from '../src/assets/yanshi_download_code.png';
import xiaoyuanCode from '../src/assets/xiaoyuan_download_code.png';
import xuzhouCode from '../src/assets/xuzhou_download_code.png';
import czeyCode from '../src/assets/czey_download_code.png';
// http://image.jingan-china.cn/v2/login/school_2.png

const liminCode = 'http://data.jingan-china.cn/v2/chem/assets/limin_download_code.png';
const changshuCode = 'http://data.jingan-china.cn/v2/chem/assets/changshu_download_code.png';
const fireCode = 'http://data.jingan-china.cn/v2/chem/assets/fire_download_code.png';
const defaultConfig = {
  logo,
  code,
  layer: 'http://data.jingan-china.cn/v2/login/jingan_download_layer.png',
  region: '无锡市',
  mail: 'jazh@jingan-china.cn',
  mainWeb: 'https://www.jingan-china.cn',
  blur: [
    'http://data.jingan-china.cn/v2/login/integration_blur.png',
    'http://data.jingan-china.cn/v2/login/production_blur.png',
    'http://data.jingan-china.cn/v2/login/fire_blur.png',
    'http://data.jingan-china.cn/v2/login/gas_blur.png',
    'http://data.jingan-china.cn/v2/login/electricity_blur.png',
    'http://data.jingan-china.cn/v2/login/smoke_blur.png',
  ],
  focus: [
    'http://data.jingan-china.cn/v2/login/integration.png',
    'http://data.jingan-china.cn/v2/login/production.png',
    'http://data.jingan-china.cn/v2/login/fire.png',
    'http://data.jingan-china.cn/v2/login/gas.png',
    'http://data.jingan-china.cn/v2/login/electricity.png',
    'http://data.jingan-china.cn/v2/login/smoke.png',
  ],
  // projectKey: 'dev',
  projectKey: 'huagong_pro',
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
  wuxi: {
    region: '无锡市',
    projectKey: 'jiangxi_pro',
    projectShortName: '无锡晶安智慧云',
    code,
    layer: 'http://data.jingan-china.cn/v2/login/wuxi_download_layer.png',
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/jxjd/official_version/JXJDInterSafe.plist&ran=',
    android:
      'http://58.215.178.100:12083/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  shimin: {
    region: '无锡市',
    projectKey: 'jiangxi_pro',
    projectShortName: '无锡晶安智慧云',
    code,
    layer: 'http://data.jingan-china.cn/v2/login/wuxi_download_layer.png',
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/jxjd/official_version/JXJDInterSafe.plist&ran=',
    android:
      'http://58.215.178.100:12083/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  ehu: {
    region: '无锡市',
    projectKey: 'jiangxi_pro',
    projectShortName: '鹅湖智慧云',
    code,
    blur: [
      'http://image.jingan-china.cn/v2/login/ehu/1_blur.png',
      'http://image.jingan-china.cn/v2/login/ehu/2_blur.png',
      'http://image.jingan-china.cn/v2/login/ehu/3_blur.png',
    ],
    focus: [
      'http://image.jingan-china.cn/v2/login/ehu/1.png',
      'http://image.jingan-china.cn/v2/login/ehu/2.png',
      'http://image.jingan-china.cn/v2/login/ehu/3.png',
    ],
    layer: 'http://data.jingan-china.cn/v2/login/wuxi_download_layer.png',
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/jxjd/official_version/JXJDInterSafe.plist&ran=',
    android:
      'http://58.215.178.100:12083/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  xuzhou: {
    region: '徐州市',
    projectKey: 'xuzhou_pro',
    projectShortName: '徐州晶安智慧云',
    location: {
      x: 117.407812,
      y: 34.501282,
      zoom: 14,
    },
    code: xuzhouCode,
    layer: 'http://data.jingan-china.cn/v2/login/xuzhou_download_layer.png',
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/xz/official_version/XZInterSafe.plist&ran=',
    android:
      'http://58.215.178.100:12081/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  limin: {
    region: '徐州市',
    logo: liminLogo,
    code: liminCode,
    layer: 'http://data.jingan-china.cn/v2/login/limin/limin_download_layer.png',
    unitName: '利民化工股份有限公司',
    projectKey: 'xuzhou_pro',
    projectShortName: '利民化工智慧云',
    location: {
      x: 117.407812,
      y: 34.501282,
      zoom: 14,
    },
    blur: [
      'http://data.jingan-china.cn/v2/login/limin/1_blur.png',
      'http://data.jingan-china.cn/v2/login/limin/2_blur.png',
      'http://data.jingan-china.cn/v2/login/limin/3_blur.png',
    ],
    focus: [
      'http://data.jingan-china.cn/v2/login/limin/1.png',
      'http://data.jingan-china.cn/v2/login/limin/2.png',
      'http://data.jingan-china.cn/v2/login/limin/3.png',
    ],
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/limin/official_version/limin.plist&ran=',
    android:
      'http://58.215.178.100:12081/acloud_new/v2/mobileVersion/version/getLatest?type=1&version=1&ran=',
  },
  changshu: {
    region: '常熟市',
    projectKey: 'changshu_pro',
    projectShortName: '常熟晶安智慧云',
    servicePhone: '400-928-3688',
    serviceSupport: '苏州晶程智慧科技有限公司',
    code: changshuCode,
    layer: 'http://data.jingan-china.cn/v2/login/changshu_download_layer.png',
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/cs/official_version/CSInterSafeZ.plist&ran=',
    android:
      'http://58.215.178.100:12080/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  fire: {
    projectKey: 'zx_pro',
    projectShortName: '智慧消防云',
    logo: fireLogo,
    code: fireCode,
    layer: 'http://image.jingan-china.cn/v2/login/fire_download_layer.png',
    serviceSupport: '',
    servicePhone: '',
  },
  xiaoyuan: {
    projectKey: 'v2_test',
    projectShortName: '校园智慧安全云',
    servicePhone: '400-928-5656',
    layer: 'http://data.jingan-china.cn/v2/login/school_download_layer.png',
    code: xiaoyuanCode,
    blur: ['http://image.jingan-china.cn/v2/login/school_2.png'],
    focus: ['http://image.jingan-china.cn/v2/login/school_1.png  '],
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/campus/official_version/CAMPUSInterSafe.plist&ran=',
    android:
      'http://58.215.178.100:12082/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  nanxiao: {
    region: '徐州市',
    logo: nanxiaoLogo,
    code: nanxiaoCode,
    layer: 'http://data.jingan-china.cn/v2/login/nanxiao/nanxiao_download_layer.png',
    unitName: '南京市消防工程有限公司',
    mail: 'jazh@jingan-china.cn',
    projectKey: 'nanxiao_pro',
    projectShortName: '南消智慧云',
    blur: [
      'http://data.jingan-china.cn/v2/login/nanxiao/1_blur.png',
      'http://data.jingan-china.cn/v2/login/nanxiao/2_blur.png',
      'http://data.jingan-china.cn/v2/login/nanxiao/3_blur.png',
    ],
    focus: [
      'http://data.jingan-china.cn/v2/login/nanxiao/1.png',
      'http://data.jingan-china.cn/v2/login/nanxiao/2.png',
      'http://data.jingan-china.cn/v2/login/nanxiao/3.png',
    ],
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/fire/official_version/FireInterSafe.plist&ran=',
    android:
      'http://58.215.178.100:12084/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  shanxi: {
    region: '山西省',
    projectKey: 'shanxi',
    projectShortName: '山西晶安智慧云',
    code: shanxiCode,
    layer: 'http://data.jingan-china.cn/v2/login/shanxi_download_layer.png',
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/sx/official_version/SXInterSafe.plist&ran=',
    android:
      'http://58.215.178.100:12085/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  show: {
    region: '无锡市',
    projectKey: 'yanshi_pro',
    projectShortName: '晶安智慧云',
    code: yanshiCode,
    layer: 'http://data.jingan-china.cn/v2/login/show_download_layer.png',
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/yanshi/official_version/yanshi.plist&ran=',
    android:
      'http://58.215.178.100:12086/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  czey: {
    region: '常州市',
    projectKey: 'czey_pro',
    projectShortName: '常州二院智慧云',
    logo: czeyLogo,
    code: czeyCode,
    layer: 'http://data.jingan-china.cn/v2/login/czey_download_layer.png',
    blur: [
      'http://data.jingan-china.cn/v2/login/czey/1_blur.png',
      'http://data.jingan-china.cn/v2/login/czey/2_blur.png',
      'http://data.jingan-china.cn/v2/login/czey/3_blur.png',
    ],
    focus: [
      'http://data.jingan-china.cn/v2/login/czey/1.png',
      'http://data.jingan-china.cn/v2/login/czey/2.png',
      'http://data.jingan-china.cn/v2/login/czey/3.png',
    ],
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/czey/official_version/Czeysafe.plist&ran=',
    android: 'http://czey.jinganyun.net/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
  },
  huishan: {
    region: '无锡市',
    projectKey: 'jiangxi_pro',
    projectShortName: '惠山街道智慧云',
    code,
    layer: 'http://data.jingan-china.cn/v2/login/wuxi_download_layer.png',
    ios:
      'itms-services://?action=download-manifest&url=https://www.jingan-china.cn/download/jxjd/official_version/JXJDInterSafe.plist&ran=',
    android:
      'http://58.215.178.100:12083/acloud_new/v2/mobileVersion/version/getLatest?type=1&ran=',
    blur: [
      'http://image.jingan-china.cn/v2/login/huishan/1_blur.png',
      'http://image.jingan-china.cn/v2/login/huishan/2_blur.png',
      'http://image.jingan-china.cn/v2/login/huishan/3_blur.png',
    ],
    focus: [
      'http://image.jingan-china.cn/v2/login/huishan/1.png',
      'http://image.jingan-china.cn/v2/login/huishan/2.png',
      'http://image.jingan-china.cn/v2/login/huishan/3.png',
    ],
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
