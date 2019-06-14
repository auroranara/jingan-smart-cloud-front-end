import React, { Fragment } from 'react';
import moment from 'moment';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
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

/**
 * 点位卡片
 */
export default class PointCard extends BigPlatformCard {
  FIELDNAMES = {
    level: 'level', // 风险等级
    name: 'name', // 点位名称
    lastCheckPerson: 'lastCheckPerson', // 上次巡查人员
    lastCheckTime: 'lastCheckTime', // 上次巡查时间
    nextCheckTime: 'nextCheckTime', // 下次巡查时间
    extendedDays: 'extendedDays', // 超期天数
    expiryDays: 'expiryDays', // 距到期天数
    status: 'status', // 检查状态
    cycle: 'cycle', // 检查周期
    type: 'type', // 点位类型，2为风险点
  };

  FIELDS = [
    {
      label: '点位名称',
      key: 'name',
      labelWrapperClassName: styles.nameLabelWrapper,
    },
    {
      label: '上次巡查人员',
      key: 'lastCheckPerson',
    },
    {
      label: '上次巡查时间',
      render: ({ lastCheckTime }) => lastCheckTime && moment(+lastCheckTime).format(TIME_FORMAT),
    },
    {
      label: '下次巡查时间',
      render: ({ nextCheckTime, cycle }) => (
        <Fragment>
          <span className={styles.nextCheckTime}>{nextCheckTime && moment(+nextCheckTime).format(TIME_FORMAT)}</span>
          <span className={styles.checkCycle}>{cycle && CHECKCYCLE[cycle] && `(${CHECKCYCLE[cycle]})`}</span>
        </Fragment>
      ),
      hidden: ({ status }) => +status !== 3 && +status !== 4,
    },
    {
      label: '超期天数',
      render: ({ extendedDays }) => <span className={styles.days}>{extendedDays && `${extendedDays}天`}</span>,
      labelWrapperClassName: styles.extendedDaysLabelWrapper,
      hidden: ({ status }) => +status !== 4,
    },
    {
      label: '距到期天数',
      render: ({ expiryDays }) => <span className={styles.days}>{expiryDays && `${expiryDays}天`}</span>,
      labelWrapperClassName: styles.expiryDaysLabelWrapper,
      hidden: ({ status }) => +status !== 3,
    },
  ];

  /**
   * 渲染风险等级标签
   * @param {string} level 风险等级
   */
  renderLevel(level) {
    let label, backgroundColor, color;
    switch(+level) {
      case 1:
      label = '红';
      backgroundColor = '#FF4848';
      color = '#fff';
      break;
      case 2:
      label = '橙';
      backgroundColor = '#F17A0A';
      color = '#fff';
      break;
      case 3:
      label = '黄';
      backgroundColor = '#FBF719';
      color = '#000';
      break;
      case 4:
      label = '蓝';
      backgroundColor = '#1E60FF';
      color = '#fff';
      break;
      default:
      label = '未评级';
      backgroundColor = '#4F6793';
      color = '#fff';
      break;
    }
    return (
      <div className={styles.level} style={{ backgroundColor, color }}>
        {label}
      </div>
    );
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { level, type } = fieldsValue;

    return (
      <Container
        className={className}
        style={style}
      >
        {+type === 2 && this.renderLevel(level)}
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
