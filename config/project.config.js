import logo from '../src/assets/logo_jingan.svg';
import code from '../src/assets/jingan_download_code.png';
import nanxiaoLogo from '../src/assets/logo_nanxiao.svg';
import nanxiaoCode from '../src/assets/nanxiao_download_code.png';
import liminLogo from '../src/assets/logo_limin.svg';
import liminCode from '../src/assets/limin_download_code.jpg';
import changshuCode from '../src/assets/changshu_download_code.jpg';
import shanxiCode from '../src/assets/shanxi_download_code.jpg';
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
  projectKey: 'v2_test',
  projectShortName: '晶安智慧云',
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
  jiangxi: {
    region: '无锡市',
    projectKey: 'jiangxi_pro',
    projectShortName: '无锡晶安智慧云',
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
  },
  changshu: {
    region: '常熟市',
    projectKey: 'changshu_pro',
    projectShortName: '常熟晶安智慧云',
    servicePhone: '400-928-3688',
    serviceSupport: '苏州晶程智慧科技有限公司',
    code: changshuCode,
  },
  eye: {},
  xuexiao: {
    projectKey: 'v2_test',
    projectShortName: '校园智慧安全云',
    servicePhone: '400-928-5656',
  },
  nanxiao: {
    region: '徐州',
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
  },
  shanxi: {
    region: '山西',
    projectKey: 'shanxi',
    projectShortName: '山西晶安智慧云',
    code: shanxiCode,
  },
  show: {
    region: '无锡',
    projectKey: 'yanshi_pro',
    projectShortName: '晶安智慧云',
  },
};

export default class Config {
  constructor(env) {
    this.config = { ...defaultConfig, ...configs[env] };
    this.config.projectName = `${this.config.projectShortName}平台`;
    switch (env) {
      case 'default':
        this.config.projectName += '（测试）';
        this.config.projectShortName += '测试';
        break;
      case 'show':
        this.config.projectName += '（演示）';
        this.config.projectShortName += '演示';
        break;
      default:
        break;
    }
  }
  toValue() {
    return this.config;
  }
}
