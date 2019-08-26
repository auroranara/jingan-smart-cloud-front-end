import React from 'react';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

/**
 * 人脸识别-监测点卡片
 */
export default class CameraCard extends BigPlatformCard {
  FIELDNAMES = {
    name: 'name', // 名称
    location: 'location', // 位置
    number: 'number', // 编号
    status: 'status', // 状态
    count: 'count', // 抓拍次数
  };

  FIELDS = [
    {
      label: '名称',
      key: 'location',
      labelWrapperClassName: styles.nameLabelWrapper,
    },
    {
      label: '编号',
      key: 'number',
      labelWrapperClassName: styles.numberLabelWrapper,
    },
  ];

  renderStatus(status) {
    if (status > 0) {
      return (
        <span className={styles.enable}>启用</span>
      );
    } else {
      return (
        <span className={styles.disable}>禁用</span>
      );
    }
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { location, count, status } = fieldsValue;

    return (
      <Container
        className={className}
        style={style}
      >
        <div className={styles.titleWrapper}>
          <span className={styles.title}>{location}</span>
          {this.renderStatus(status)}
        </div>
        {this.renderFields(fieldsValue)}
        <div className={styles.count}>今日抓拍报警：<span>{count}</span> 次</div>
      </Container>
    );
  }
}
