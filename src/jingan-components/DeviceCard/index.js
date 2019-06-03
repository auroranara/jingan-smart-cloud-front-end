import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD HH:mm';
// 字典
const STATUS_DICT = {
  '-3': '故障',
  '-1': '失联',
  '0': '正常',
  '1': '报警',
  '2': '报警',
  报警: '报警',
  火警: '火警',
  故障: '故障',
  失联: '失联',
};
// 颜色
const STATUS_COLOR = {
  '-3': '#ffb400',
  '-1': '#9f9f9f',
  '0': '#37a460',
  '1': '#f83329',
  '2': '#f83329',
  报警: '#f83329',
  火警: '#f83329',
  故障: '#ffb400',
  失联: '#9f9f9f',
};
// 消防主机
const FIRE_ENGINE = '消防主机监测';
// 是消防主机
const isFireEngine = ({ monitoringType }) => monitoringType === FIRE_ENGINE;
// 不是消防主机
const notFireEngine = ({ monitoringType }) => monitoringType !== FIRE_ENGINE;

/**
 * 判断是否为Number类型
 * @param {Any} value 判断对象
 * @return true是Number类型，false不是Number类型
 */
const isNumber = value => {
  return Object.prototype.toString.call(value) === '[object Number]';
};

export default class DeviceCard extends BigPlatformCard {
  FIELDNAMES = {
    monitoringType: 'monitoringType', // 监测类型
    name: 'name', // 传感器名称
    relationId: 'relationId', // 传感器id或主机编号
    location: 'location', // 区域位置
    status: 'status', // 状态
    params: 'params', // 参数
    time: 'time', // 报警时间
    system: 'system', // 设备系统
    number: 'number', // 储罐位号
    loopNumber: 'loopNumber', // 回路号
    partNumber: 'partNumber', // 故障号
    partType: 'partType', // 设施部件类型
  };

  FIELDS = [
    {
      label: '主机编号',
      key: 'relationId',
      hidden: notFireEngine,
      className: styles.row,
    },
    {
      label: '回路故障号',
      render: ({ loopNumber, partNumber }) =>
        `${loopNumber || isNumber(loopNumber) ? `${loopNumber}号回路` : ''}${
          partNumber || isNumber(partNumber) ? `${partNumber}号` : ''
        }`,
      hidden: notFireEngine,
      className: styles.row,
    },
    {
      label: '设施部件类型',
      key: 'partType',
      hidden: notFireEngine,
      className: styles.row,
    },
    {
      label({ monitoringType }) {
        if (monitoringType === '水系统监测') {
          return '设备名称';
        } else if (monitoringType === '储罐监测') {
          return '储罐名称';
        } else {
          return '传感器名称';
        }
      },
      key: 'name',
      hidden: isFireEngine,
      className: styles.row,
    },
    {
      label({ monitoringType }) {
        if (monitoringType === '水系统监测') {
          return '设备系统';
        } else if (monitoringType === '储罐监测') {
          return '储罐位号';
        } else {
          return '传感器ID';
        }
      },
      render({ monitoringType, relationId, system, number }) {
        if (monitoringType === '水系统监测') {
          return system;
        } else if (monitoringType === '储罐监测') {
          return number;
        } else {
          return relationId;
        }
      },
      hidden: isFireEngine,
      className: styles.row,
    },
    {
      label: ({ monitoringType }) => (monitoringType !== FIRE_ENGINE ? '区域位置' : '具体位置'),
      key: 'location',
      className: styles.row,
    },
    {
      label: '状态',
      render({ status, params, monitoringType }) {
        let label = STATUS_DICT[status];
        if (monitoringType === FIRE_ENGINE) {
          if (status === 2) {
            label = params;
          }
          params = null;
        }
        return (
          label && (
            <div className={styles.statusItem}>
              <div
                className={styles.statusItemIcon}
                style={{ backgroundColor: STATUS_COLOR[status] }}
              />
              <div className={styles.statusItemLabel}>
                {label}
                {params && `（${params}）`}
              </div>
            </div>
          )
        );
      },
      className: classNames(styles.row, styles.statusRow),
    },
    {
      label: ({ status }) => (STATUS_DICT[status] ? `${STATUS_DICT[status]}时间` : '发生时间'),
      render: ({ time }) => time && moment(+time).format(TIME_FORMAT),
      className: styles.row,
    },
  ];

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { monitoringType } = fieldsValue;

    return (
      <Container className={className} style={style}>
        <div className={styles.title}>{monitoringType}</div>
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
