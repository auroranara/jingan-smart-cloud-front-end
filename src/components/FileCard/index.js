import React from 'react';
import moment from 'moment';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';

export default class FileCard extends BigPlatformCard {
  FIELDNAMES = {
    infoType: 'infoType', // 信息类型
    name: 'name', // 名称
    expiredType: 'expiredType', // 过期类型
    expireDate: 'expireDate', // 到期日期
    expiredDays: 'expiredDays', // 过期天数
  };

  FIELDS = [
    {
      label: '信息类型',
      key: 'infoType',
    },
    {
      label: '名称',
      key: 'name',
      labelWrapperClassName: styles.nameLabelWrapper,
    },
    {
      label: '过期类型',
      key: 'expiredType',
    },
    {
      label: '到期日期',
      render: ({ expireDate }) => expireDate && moment(+expireDate).format(TIME_FORMAT),
    },
    {
      label: '过期天数',
      key: 'expiredDays',
      valueContainerClassName: styles.expiredDaysValueContainer,
    },
  ];

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
    } = this.props;

    return (
      <Container
        className={className}
        style={style}
      >
        {this.renderFields()}
      </Container>
    );
  }
}
