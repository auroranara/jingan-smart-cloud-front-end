import logo from '../src/assets/logo.svg';
import nanxiaoLogo from '../src/assets/nanxiao-logo.svg';
const defaultConfig = {
  logo,
  region: '无锡市',
  mail: 'jazh@jingan-china.cn',
  mainWeb: 'https://www.jingan-china.cn',
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
  default: {},
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
  changshu: {
    region: '常熟市',
    projectKey: 'changshu_pro',
    projectShortName: '常熟晶安智慧云',
    servicePhone: '400-928-3688',
    serviceSupport: '苏州晶程智慧科技有限公司',
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
    mail: 'jazh@jingan-china.cn',
    projectKey: 'nanxiao_pro',
    projectShortName: '南消智慧云',
  },
  shanxi: {
    region: '山西',
    projectKey: 'shanxi',
    projectShortName: '山西晶安智慧云',
  },
  yanshi: {
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
      case 'yanshi':
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
