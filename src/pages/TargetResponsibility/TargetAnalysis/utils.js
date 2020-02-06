import DepartNumIcon from "./departNum.png";
import DepartPie from './components/DepartPie';
import DepartLine from './components/DepartLine';
import IndexChartsLine from './components/IndexChartsLine';
const LIST_URL = '/target-responsibility/target-analysis/index'

export {DepartNumIcon,DepartPie,DepartLine,IndexChartsLine};

export const BREADCRUMBLIST = [
    // modify
    { title: '首页', name: '首页', href: '/' },
    { title: '目标责任管理', name: '目标责任管理' },
    { title: '目标责任分析报表', name: '目标责任分析报表', href: LIST_URL },
  ];
  