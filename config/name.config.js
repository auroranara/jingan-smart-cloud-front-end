const configs = {
  default: '晶安智慧云化工平台',
  wuxi: '无锡晶安智慧云',
  ehu: '鹅湖智慧云',
  xuzhou: '徐州晶安智慧云',
  limin: '利民化工智慧云',
  changshu: '常熟晶安智慧云',
  fire: '智慧消防云',
  xiaoyuan: '校园智慧安全云',
  nanxiao: '南消智慧云',
  shanxi: '山西晶安智慧云',
  show: '晶安智慧云',
  czey: '常州二院智慧云',
  huishan: '惠山街道智慧云',
};
module.exports = (env = 'default') => {
  return configs[env];
};
