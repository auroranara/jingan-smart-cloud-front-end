import DepartNumIcon from './image/departNum.png';
import MonthIcon from './image/monthIcon.png';
import QuarterIcon from './image/quarterIcon.png';
import YearIcon from './image/yearIcon.png';

import DepartPie from './components/DepartPie';
import DepartLine from './components/DepartLine';
import IndexChartsLine from './components/IndexChartsLine';
const LIST_URL = '/target-responsibility/target-analysis/company-list';

export { DepartNumIcon, DepartPie, DepartLine, MonthIcon, YearIcon, QuarterIcon, IndexChartsLine };

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '目标责任管理', name: '目标责任管理' },
  { title: '目标责任企业列表', name: '目标责任企业列表', href: LIST_URL },
  { title: '目标责任分析报表', name: '目标责任分析报表' },
];
