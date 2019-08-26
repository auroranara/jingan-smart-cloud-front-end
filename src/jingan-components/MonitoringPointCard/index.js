import React from 'react';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

/**
 * 人脸识别-监测点卡片
 */
export default class MonitoringPointCard extends BigPlatformCard {
  FIELDNAMES = {
    name: 'name', // 名称
    location: 'location', // 位置
    cameraNumber: 'cameraNumber', // 摄像机编号
  };

  FIELDS = [
    {
      label: '位置',
      key: 'location',
      labelWrapperClassName: styles.locationLabelWrapper,
    },
    {
      label: '摄像机编号',
      key: 'cameraNumber',
      labelWrapperClassName: styles.cameraNumberLabelWrapper,
    },
  ];

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { name } = fieldsValue;

    return (
      <Container
        className={className}
        style={style}
      >
        <div className={styles.title}>{name}</div>
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
