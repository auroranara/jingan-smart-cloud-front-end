import React from 'react';
import BigPlatformCard from '../BigPlatformCard';
import moment from 'moment';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

/**
 * 人脸识别-监测点卡片
 */
export default class CaptureCard extends BigPlatformCard {
  FIELDNAMES = {
    name: 'name', // 姓名
    location: 'location', // 位置
    time: 'time', // 时间
    similarity: 'similarity', // 相似度
    image: 'image', // 图片
  };

  FIELDS = [
    {
      label: '抓拍时间',
      render: ({ time }) => time && moment(time).format('YYYY-MM-DD HH:mm:ss'),
      labelWrapperClassName: styles.timeLabelWrapper,
      className: styles.row,
    },
    {
      label: '抓拍位置',
      key: 'location',
      labelWrapperClassName: styles.locationLabelWrapper,
      className: styles.row,
    },
    {
      label: '姓名',
      key: 'name',
      labelWrapperClassName: styles.nameLabelWrapper,
      className: styles.row,
    },
    {
      label: '相似度',
      // key: 'similarity',
      render: ({ similarity }) => `${similarity}%`,
      labelWrapperClassName: styles.similarityLabelWrapper,
      className: styles.row,
    },
  ];

  handleClick = () => {
    const { data, onClick } = this.props;
    onClick && onClick(data);
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
      onClickImage,
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { image } = fieldsValue;
    const images = Array.isArray(image) ? image : [image];

    return (
      <Container
        className={className}
        style={style}
      >
        <div className={styles.wrapper}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${images[0]})` }}
            onClick={() => onClickImage && onClickImage(images)}
          />
          <div className={styles.fieldsWrapper}>
            {this.renderFields(fieldsValue)}
          </div>
        </div>
        <div className={styles.detail} onClick={this.handleClick}>详情></div>
      </Container>
    );
  }
}
