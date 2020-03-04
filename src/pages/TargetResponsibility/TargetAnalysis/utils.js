import DepartNumIcon from './image/departNum.png';
import MonthIcon from './image/monthIcon.png';
import QuarterIcon from './image/quarterIcon.png';
import YearIcon from './image/yearIcon.png';

import { Icon } from 'antd';
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

export const ReachList = [
  { key: '1', value: '全部' },
  { key: '2', value: '已达成' },
  { key: '3', value: '未达成' },
];

export const COLOUMNS = [
  {
    title: '责任主体',
    dataIndex: 'duty',
    align: 'center',
  },
  {
    title: '指标',
    dataIndex: 'index',
    align: 'center',
  },
  {
    title: '目标值',
    dataIndex: 'desc',
    align: 'center',
  },
  {
    title: '是否达成',
    dataIndex: 'isReach',
    align: 'center',
    render: val => {
      return +val === 1 ? <Icon type="check" /> : <Icon type="close" />;
    },
  },
  {
    title: '未达成原因',
    dataIndex: 'reason',
    align: 'center',
  },
];
