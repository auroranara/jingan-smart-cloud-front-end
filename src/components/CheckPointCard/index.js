import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import styles from './index.less';

// 默认字段名
const FIELDNAMES = {
  level: 'level', // 风险等级
  name: 'name', // 点位名称
  lastCheckPerson: 'lastCheckPerson', // 上次巡查人员
  lastCheckTime: 'lastCheckTime', // 上次巡查时间
  nextCheckTime: 'nextCheckTime', // 下次巡查时间
  extendedDays: 'extendedDays', // 超期天数
  expiryDays: 'expiryDays', // 距到期天数
  status: 'status', // 检查状态
};
// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';

export default class CheckPointCard extends PureComponent {
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

  /**
   * 渲染字段
   */
  renderField({ label, value, className }) {
    return (
      <div className={classNames(styles.row, className)} key={label}>
        <div className={styles.label}><span className={styles.labelWrapper}>{label}</span>：</div>
        <div className={styles.value}>{value}</div>
      </div>
    );
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
      data, // 源数据
      fieldNames, // 自定义字段
    } = this.props;

    const { level, name, lastCheckPerson, lastCheckTime, nextCheckTime, extendedDays, expiryDays, status } = { ...FIELDNAMES, ...fieldNames };
    const fields = [
      {
        label: '点位名称',
        value: data[name],
        className: styles.name,
      },
      {
        label: '上次巡查人员',
        value: data[lastCheckPerson],
      },
      {
        label: '上次巡查时间',
        value: data[lastCheckTime] && moment(+data[lastCheckTime]).format(TIME_FORMAT),
      },
    ];
    if (+data[status] === 4) {
      fields.push({
        label: '下次巡查时间',
        value: data[nextCheckTime] && moment(+data[nextCheckTime]).format(TIME_FORMAT),
      }, {
        label: '超期天数',
        value: `${data[extendedDays]}天`,
        className: styles.extendedDays,
      });
    } else if (+data[status] === 3) {
      fields.push({
        label: '下次巡查时间',
        value: data[nextCheckTime] && moment(+data[nextCheckTime]).format(TIME_FORMAT),
      }, {
        label: '距到期天数',
        value: `${data[expiryDays]}天`,
        className: styles.expiryDays,
      });
    }

    return (
      <section
        className={classNames(styles.container, className)}
        style={{ ...style }}
      >
        {data[level] && this.renderLevel(data[level])}
        {fields.map(this.renderField)}
      </section>
    );
  }
}
