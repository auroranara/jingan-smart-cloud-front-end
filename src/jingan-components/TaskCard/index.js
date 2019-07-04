import React, { Fragment } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
// import Ellipsis from '@/components/Ellipsis';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// 非消防主机
const isNotFireEngine = ({ type }) => type !== '消防主机';
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
    systemType: 'systemType', // 系统类型
    deviceName: 'deviceName', // 设备名称
    repairPersonName: 'repairPersonName', // 报修人员名称
    repairPersonPhone: 'repairPersonPhone', // 报修人员手机号
    process: 'process', // 处理状态
    repeat: 'repeat', // 重复次数
    firstTime: 'firstTime', // 首次发生时间
    lastTime: 'lastTime', // 最近发生时间
  };

  FIELDS = [
    {
      label: '部件类型',
      key: 'partType',
      hidden: isNotFireEngine,
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '回路号',
      render: ({ loopNumber, partNumber }) =>
        `${loopNumber || isNumber(loopNumber) ? `${loopNumber}回路` : ''}${
          partNumber || isNumber(partNumber) ? `${partNumber}号` : ''
        }`,
      hidden: isNotFireEngine,
      labelWrapperClassName: styles.loopNumberLabelWrapper,
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '安装位置',
      render: ({ area, location }) => [area, location].filter(v => v).join('-'),
      hidden: ({ type }) => type !== '独立烟感',
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '系统类型',
      key: 'systemType',
      hidden: isNotRepair,
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '设备名称',
      key: 'deviceName',
      hidden: isNotRepair,
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '报修人员',
      render: ({ repairPersonName, repairPersonPhone }) => <span className={styles.multipleValue}>{[repairPersonName, repairPersonPhone].filter(v => v).map((v, i) => <span key={i}>{v}</span>)}</span>,
      hidden: isNotRepair,
      labelContainerClassName: styles.labelContainer,
    },
    {
      label({ type }) {
        if (type === '报修') {
          return '报修时间';
        } else {
          return '发生时间';
        }
      },
      render: ({ startTime }) => <span className={styles.multipleValue}>{startTime && moment(+startTime).format(TIME_FORMAT).split(' ').map((v, i) => <span key={i}>{v}</span>)}</span>,
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '完成时间',
      render: ({ endTime }) => <span className={styles.multipleValue}>{endTime && moment(+endTime).format(TIME_FORMAT).split(' ').map((v, i) => <span key={i}>{v}</span>)}</span>,
      hidden: ({ process }) => process !== '已处理',
      labelContainerClassName: styles.labelContainer,
    },
  ];

  handleClick = () => {
    const { onClick, data } = this.props;
    onClick && onClick(data);
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { companyName, status, type, repeat, firstTime, lastTime } = fieldsValue;
    const color = statusColor[status];

    return (
      <Container className={className} style={{ paddingTop: '0.5em', paddingBottom: '0.5em', ...style }}>
        <div className={styles.titleWrapper}>
          {type !== '报修' && color && <div className={styles.status} style={{ color, borderColor: color }}>{status}</div>}
          <div className={styles.title}>{companyName}</div>
          {repeat > 1 && (
            <Tooltip
              overlayClassName={styles.tooltip}
              placement="bottom"
              title={
                <Fragment>
                  <div>首次发生：{firstTime && moment(+firstTime).format(TIME_FORMAT)}</div>
                  <div>最近发生：{lastTime && moment(+lastTime).format(TIME_FORMAT)}</div>
                </Fragment>
              }
            >
              <div className={styles.repeat}>重复上报{repeat}次</div>
            </Tooltip>
          )}
        </div>
        <div className={styles.action} onClick={this.handleClick}>处理动态>></div>
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
