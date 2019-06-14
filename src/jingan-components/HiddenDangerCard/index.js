import React, { Fragment } from 'react';
import moment from 'moment';
import { hiddenDangerSource } from '@/utils/dict';
import Ellipsis from '@/components/Ellipsis';
import environment from '@/assets/environment.png';
import fireControl from '@/assets/fire-control.png';
import hygiene from '@/assets/hygiene.png';
import safety from '@/assets/safety.png';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';
// 隐患类型图标映射
const TYPE_ICONS = {
  1: safety,
  2: fireControl,
  3: environment,
  4: hygiene,
};

/**
 * 隐患卡片
 */
export default class HiddenDangerCard extends BigPlatformCard {
  FIELDNAMES = {
    status: 'status', // 隐患状态
    type: 'type', // 隐患类型
    description: 'description', // 隐患描述
    images: 'images', // 图片地址
    name: 'name', // 点位名称
    source: 'source', // 来源
    reportPerson: 'reportPerson', // 上报人
    reportTime: 'reportTime', // 上报时间
    planRectificationPerson: 'planRectificationPerson', // 计划整改人
    planRectificationTime: 'planRectificationTime', // 计划整改时间
    actualRectificationPerson: 'actualRectificationPerson', // 实际整改人
    actualRectificationTime: 'actualRectificationTime', // 实际整改时间
    designatedReviewPerson: 'designatedReviewPerson', // 指定复查人
    reviewTime: 'reviewTime', // 复查时间
  };

  FIELDS = [
    {
      label: '点位名称',
      key: 'name',
    },
    {
      label: '来源',
      render: ({ source }) => hiddenDangerSource[source],
      labelWrapperClassName: styles.sourceLabelWrapper,
    },
    {
      label: '上报',
      render: ({ reportPerson, reportTime }) => (
        <Fragment>
          <span className={styles.reportPerson}>{reportPerson}</span>
          {reportTime && moment(reportTime).format(TIME_FORMAT)}
        </Fragment>
      ),
      labelWrapperClassName: styles.reportLabelWrapper,
    },
    {
      label: '计划整改',
      render: ({ planRectificationPerson, planRectificationTime, status }) => (
        <Fragment>
          <span className={styles.planRectificationPerson}>{planRectificationPerson}</span>
          <span className={+status === 7 ? styles.expiredPlanRectificationTime : undefined}>{planRectificationTime && moment(planRectificationTime).format(TIME_FORMAT)}</span>
        </Fragment>
      ),
      hidden: ({ status }) => ![1, 2, 7].includes(+status),
    },
    {
      label: '实际整改',
      render: ({ actualRectificationPerson, actualRectificationTime }) => (
        <Fragment>
          <span className={styles.actualRectificationPerson}>{actualRectificationPerson}</span>
          {actualRectificationTime && moment(actualRectificationTime).format(TIME_FORMAT)}
        </Fragment>
      ),
      hidden: ({ status }) => ![3, 4].includes(+status),
    },
    {
      label: '指定复查',
      key: 'designatedReviewPerson',
      hidden: ({ status }) => +status !== 3,
    },
    {
      label: '复查',
      render: ({ designatedReviewPerson, reviewTime }) => (
        <Fragment>
          <span className={styles.reviewPerson}>{designatedReviewPerson}</span>
          {reviewTime && moment(reviewTime).format(TIME_FORMAT)}
        </Fragment>
      ),
      labelWrapperClassName: styles.reviewLabelWrapper,
      hidden: ({ status }) => +status !== 4,
    },
  ];

  /**
   * 渲染隐患状态标签
   * @param {string} status 隐患状态
   */
  renderStatus(status) {
    let label, backgroundColor;
    switch (+status) {
      case 1:
      case 2:
        label = '未超期';
        backgroundColor = '#0967D3';
        break;
      case 7:
        label = '已超期';
        backgroundColor = '#FF4848';
        break;
      case 3:
        label = '待复查';
        backgroundColor = '#0967D3';
        break;
      case 4:
        label = '已关闭';
        backgroundColor = '#4F6793';
        break;
      default:
        break;
    }
    return label && (
      <div className={styles.status} style={{ backgroundColor }}>
        {label}
      </div>
    );
  }

  render() {
    const {
      className, // 容器类名
      style, // 容器样式
      onClickImage, // 图片点击事件
    } = this.props;
    const fieldsValue = this.getFieldsValue();
    const { images, type, description, status } = fieldsValue;

    return (
      <Container
        className={className}
        style={{ paddingTop: '0.75em', ...style }}
      >
        {status && this.renderStatus(status)}
        <div className={styles.titleWrapper}>
          <div className={styles.titleIcon} style={{ backgroundImage: `url(${TYPE_ICONS[type]})` }} />
          <div className={styles.title}><Ellipsis className={styles.ellipsisTitle} lines={1} tooltip>{description}</Ellipsis></div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.imageWrapper}>
            {images && images.length > 0 && images[0] && (
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${images[0]})`, cursor: onClickImage ? 'pointer' : 'auto' }}
                onClick={onClickImage && (() => onClickImage(images))} />
            )}
          </div>
          <div className={styles.fieldsWrapper}>
            {this.renderFields(fieldsValue)}
          </div>
        </div>
      </Container>
    );
  }
}
