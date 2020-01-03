import React from 'react';
import moment from 'moment';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';


/**
 * 特种设备卡片
 */
export default class SpecialEquipmentCard extends BigPlatformCard {
  FIELDNAMES = {
    name: 'name', // 设备名称
    number: 'number', // 出厂编号
    person: 'person', // 负责人
    expiryDate: 'expiryDate', // 有效期至
    status: 'status', // 1为已过期，0为未过期
  };

  FIELDS = [
    {
      label: '设备名称',
      key: 'name',
    },
    {
      label: '出厂编号',
      key: 'number',
    },
    {
      label: '负责人',
      key: 'person',
      labelWrapperClassName: styles.personLabelWrapper,
    },
    {
      label: '有效期至',
      render: ({ expiryDate, status }) => <span style={{ color: +status === 1 && '#ff4848' }}>{expiryDate && moment(+expiryDate).format(TIME_FORMAT)}</span>,
    },
  ];

  /**
   * 渲染状态
   */
  renderStatus (status) {
    const { statusLabel, statusColor = '#1E60FF' } = this.props;
    if (statusLabel) {
      return <div className={styles.status} style={{ backgroundColor: statusColor }}>{statusLabel}</div>
    }
    let label, backgroundColor;
    if (+status === 1) {
      label = '已过期';
      backgroundColor = '#FF4848';
    } else {
      label = '未过期';
      backgroundColor = '#1E60FF';
    }
    return <div className={styles.status} style={{ backgroundColor }}>{label}</div>
  }

  render () {
    const {
      className, // 容器类名
      style, // 容器样式
    } = this.props;
    const fieldsValue = this.getFieldsValue();

    return (
      <Container
        className={className}
        style={style}
      >
        {this.renderStatus(fieldsValue.status)}
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
