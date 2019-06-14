import React from 'react';
import moment from 'moment';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// 非消防主机
const isNotFireEngine = ({ type }) => type !== '消防主机';
// 报修
const isRepair = ({ type }) => type === '报修';
// 非报修
const isNotRepair = ({ type }) => type !== '报修';
// 状态
const statusColor = {
  '火警': '#f83329',
  '故障': '#eeab07',
};

/**
 * 判断是否为Number类型
 * @param {Any} value 判断对象
 * @return true是Number类型，false不是Number类型
 */
const isNumber = value => {
  return Object.prototype.toString.call(value) === '[object Number]';
};

export default class TaskCard extends BigPlatformCard {
  FIELDNAMES = {
    id: 'id', // 主键
    type: 'type', // 类型
    companyName: 'companyName', // 企业名称
    partType: 'partType', // 设施部件类型
    loopNumber: 'loopNumber', // 回路号
    partNumber: 'partNumber', // 故障号
    area: 'area', // 区域
    location: 'location', // 位置
    startTime: 'startTime', // 报警/报修时间
    endTime: 'endTime', // 结束时间
    status: 'status', // 状态
    wordOrderNumber: 'wordOrderNumber', // 工单编号
    repairPersonName: 'repairPersonName', // 报修人员名称
    repairPersonPhone: 'repairPersonPhone', // 报修人员手机号
    process: 'process', // 处理状态
  };

  FIELDS = [
    {
      label: '部件类型',
      key: 'partType',
      hidden: isNotFireEngine,
    },
    {
      label: '回路号',
      render: ({ loopNumber, partNumber }) =>
        `${loopNumber || isNumber(loopNumber) ? `${loopNumber}号回路` : ''}${
          partNumber || isNumber(partNumber) ? `${partNumber}号` : ''
        }`,
      hidden: isNotFireEngine,
      labelWrapperClassName: styles.loopNumberLabelWrapper,
    },
    {
      label: '工单编号',
      key: 'wordOrderNumber',
      hidden: isNotRepair,
    },
    {
      label: '报修人员',
      render: ({ repairPersonName, repairPersonPhone }) => <span><span className={styles.repairPersonName}>{repairPersonName}</span>{repairPersonPhone}</span>,
      hidden: isNotRepair,
    },
    {
      label: '安装位置',
      render: ({ area, location }) => [area, location].filter(v => v).join('-'),
      hidden: isRepair,
    },
    {
      label({ type }) {
        if (type === '报修') {
          return '报修时间';
        } else {
          return '报警时间';
        }
      },
      render: ({ startTime }) => startTime && moment(+startTime).format(TIME_FORMAT),
    },
    {
      label: '结束时间',
      render: ({ endTime }) => endTime && moment(+endTime).format(TIME_FORMAT),
      hidden: ({ process }) => process !== '已处理',
    },
  ];

  handleClick = (e) => {
    const { onClick } = this.props;
    const id = e.currentTarget.getAttribute('data-id');
    onClick && onClick(id);
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { id, companyName, status, type } = fieldsValue;
    const color = statusColor[status];

    return (
      <Container className={className} style={{ paddingTop: '0.5em', paddingBottom: '0.5em', ...style }}>
        <div className={styles.title}>{companyName}</div>
        {type !== '报修' && color && <div className={styles.status} style={{ color, borderColor: color }}>{status}</div>}
        <div className={styles.action} data-id={id} onClick={this.handleClick}>处理动态>></div>
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
