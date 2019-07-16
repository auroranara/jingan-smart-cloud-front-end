import React, { Fragment } from 'react';
import moment from 'moment';
// import Ellipsis from '@/components/Ellipsis';
import BigPlatformCard from '@/jingan-components/BigPlatformCard';
// 引入样式文件
import styles from './CheckPointCard.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';
// 检查周期
const CHECKCYCLE = {
  every_day: '每日一次',
  every_week: '每周一次',
  every_month: '每月一次',
  every_quarter: '每季度一次',
  every_half_year: '每半年一次',
  every_year: '每年一次',
};

const STATUS = [
  { label: '已检查', backgroundColor: '#9F9F9F' },
  { label: '已检查', backgroundColor: '#9F9F9F' },
  { label: '待检查', backgroundColor: '#0967D3' },
  { label: '已超期', backgroundColor: '#FF4848' },
];

const ReportSource = ['企业', '政府', '维保'];

const NO_DATA = '暂无数据';

const renderLevel = lvl => {
  let label, backgroundColor;
  switch (+lvl) {
    case 1:
      label = '红';
      backgroundColor = '#FF4848';
      break;
    case 2:
      label = '橙';
      backgroundColor = '#F17A0A';
      break;
    case 3:
      label = '黄';
      backgroundColor = '#FBF719';
      break;
    case 4:
      label = '蓝';
      backgroundColor = '#1E60FF';
      break;
    default:
      label = '未评级';
      backgroundColor = '#4F6793';
      break;
  }
  return (
    <div className={styles.level}>
      {label}
      <span className={styles.rect} style={{ backgroundColor }} />
    </div>
  );
};

export default class CheckPointCard extends BigPlatformCard {
  FIELDNAMES = {
    id: 'id', // 主键
    name: 'name', // 点位名称
    riskLevel: 'riskLevel', // 风险等级
    currentDanger: 'currentDanger', // 有无隐患
    lastCheckTime: 'lastCheckTime', // 最近一次巡查
    nextCheckTime: 'nextCheckTime', // 计划下次巡查
    extendedDays: 'extendedDays', // 超期天数
    expiryDays: 'expiryDays', // 距到期天数
    status: 'status', // 检查状态
    cycle: 'cycle', // 检查周期
    type: 'type', // 点位类型，2为风险点
    lastReportSource: 'lastReportSource', // 上次巡查人员所属单位类型
  };

  FIELDS = [
    {
      label: '点位名称',
      key: 'name',
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '风险等级',
      render: ({ riskLevel }) => renderLevel(riskLevel),
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '有无隐患',
      render: ({ currentDanger }) => (
        <span className={currentDanger ? styles.red : undefined}>
          {currentDanger ? `有${currentDanger}条隐患` : '无'}
        </span>
      ),
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '最近一次巡查',
      key: 'systemType',
      render: ({ lastCheckTime, lastCheckPerson, lastReportSource }) => (
        <Fragment>
          <div>
            {lastCheckPerson
              ? `${lastCheckPerson}(${ReportSource[+lastReportSource - 1]})`
              : NO_DATA}
          </div>
          <div style={{ paddingTop: '8px' }}>
            {(lastCheckTime && moment(+lastCheckTime).format(TIME_FORMAT)) || NO_DATA}
          </div>
        </Fragment>
      ),
      labelContainerClassName: styles.labelContainer,
      className: styles.lastCheckTime,
    },
    {
      label: '计划下次巡查',
      key: 'deviceName',
      render: ({ nextCheckTime, cycle }) => (
        <Fragment>
          <span>{(nextCheckTime && moment(+nextCheckTime).format(TIME_FORMAT)) || NO_DATA}</span>
          <span className={styles.checkCycle}>
            {cycle && CHECKCYCLE[cycle] && `(${CHECKCYCLE[cycle]})`}
          </span>
        </Fragment>
      ),
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '超期天数',
      render: ({ extendedDays }) => (
        <span className={extendedDays && extendedDays !== 0 ? styles.red : undefined}>
          {extendedDays !== '' ? extendedDays : NO_DATA}
        </span>
      ),
      hidden: ({ status }) => +status !== 4,
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '距到期天数',
      key: 'deviceName',
      render: ({ expiryDays }) => (
        <span className={expiryDays && expiryDays !== 0 ? styles.red : undefined}>
          {expiryDays !== '' ? expiryDays : NO_DATA}
        </span>
      ),
      hidden: ({ status }) => +status !== 3,
      labelContainerClassName: styles.labelContainer,
    },
  ];

  handleClick = () => {
    const { onClick, data } = this.props;
    onClick && onClick(data);
  };

  render() {
    const {
      className, // 容器类名
      style = {}, // 容器样式
      onClick,
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { status } = fieldsValue;

    return (
      <Container
        className={className}
        style={{
          paddingTop: '0.5em',
          paddingBottom: '0.5em',
          ...style,
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        <div
          className={styles.status}
          style={{ backgroundColor: STATUS[+status - 1].backgroundColor }}
        >
          {STATUS[+status - 1].label}
        </div>
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
