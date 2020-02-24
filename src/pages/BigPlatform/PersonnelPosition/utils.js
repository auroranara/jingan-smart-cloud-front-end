// import headerBg from '@/assets/new-header-bg.png';

const headerBg = 'http://data.jingan-china.cn/v2/chem/assets/new-header-bg.png';
export const SRC = 'http://chem2.joysuch.com/js/tunnel.html?to=location&buildId=200647&wh=false&appid=yanshi&secret=4011a04a6615406a9bbe84fcf30533de';
export const SRC_BASES = ['location', 'trackSn', 'behaviorAnalysis', 'alarms', 'statistics', 'regionalSecurity'];
export const CONTENT_STYLE = { position: 'relative', height: '90.37037%', zIndex: 0 };
export const HEADER_STYLE = {
  top: 0,
  left: 0,
  width: '100%',
  fontSize: 16,
  zIndex: 99,
  backgroundImage: `url(${headerBg})`,
  backgroundSize: '100% 100%',
};

export const IMGS = [
  { name: '定位监控', icon: 'monitor' },
  { name: '目标跟踪', icon: 'track' },
  { name: '行为分析', icon: 'analysis' },
  { name: '报警查看', icon: 'alarm' },
  { name: '报表统计', icon: 'report' },
  { name: '区域安全', icon: 'section' },
];
