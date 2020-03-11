import DepartNumIcon from './image/departNum.png';
import MonthIcon from './image/monthIcon.png';
import QuarterIcon from './image/quarterIcon.png';
import YearIcon from './image/yearIcon.png';
import moment from 'moment';
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
  { key: '0', value: '全部' },
  { key: '1', value: '已达成' },
  { key: '2', value: '未达成' },
];

const getQuarter = {
  1: '一季度',
  2: '二季度',
  3: '三季度',
  4: '四季度',
};

export const COLOUMNS = [
  {
    title: '责任主体',
    dataIndex: 'name',
    align: 'center',
    render: (val, text) => {
      return text.dutyMajor === '1' ? '单位' : val;
    },
  },
  {
    title: '指标',
    dataIndex: 'targetName',
    align: 'center',
  },
  {
    title: '目标值',
    dataIndex: 'goalValue',
    align: 'center',
  },
  {
    title: '是否达成',
    dataIndex: 'goalFlag',
    align: 'center',
    render: val => {
      return +val === 1 ? <Icon type="check" /> : <Icon type="close" />;
    },
  },
  {
    title: '未达成原因',
    dataIndex: 'vetoFlag',
    align: 'center',
    render: (val, text) => {
      const { reason, monthReason, safeProductGoalValueList } = text;
      const empty = <span>&nbsp;&nbsp;</span>;
      const valueIndex = safeProductGoalValueList
        ? safeProductGoalValueList.map((item, index) => {
            const { checkFrequency, examtime, indexValue } = item;
            return (
              (+checkFrequency === 1 && (
                <span>
                  <span>
                    {moment(examtime).format('M月')}: {indexValue};{empty}
                  </span>
                </span>
              )) ||
              (+checkFrequency === 2 && (
                <span>
                  <span>
                    {getQuarter[examtime.substr(5, 6)]}: {indexValue};{empty}
                  </span>
                </span>
              )) ||
              (+checkFrequency === 3 && (
                <span>
                  <span>
                    {examtime}
                    年: {indexValue};{empty}
                  </span>
                </span>
              ))
            );
          })
        : '';
      return +val === 0 ? reason : valueIndex.concat(monthReason);
    },
  },
];
