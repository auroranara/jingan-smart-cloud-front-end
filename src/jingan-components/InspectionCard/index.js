import React, { Fragment } from 'react';
import moment from 'moment';
import BigPlatformCard from '../BigPlatformCard';
// 引入样式文件
import styles from './index.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';

/**
 * 巡查卡片
 */
export default class InspectionCard extends BigPlatformCard {
  FIELDNAMES = {
    date: 'date', // 巡查日期
    person: 'person', // 巡查人
    status: 'status', // 巡查结果
    result: 'result', // 处理结果
  };

  FIELDS = [
    {
      label: '巡查日期',
      render: ({ date }) => date && moment(+date).format(TIME_FORMAT),
    },
    {
      label: '巡查人',
      key: 'person',
      labelWrapperClassName: styles.personLabelWrapper,
    },
    {
      label: '巡查结果',
      render({ status }) {
        const isAbnormal = +status !== 1;
        return (
          <span style={{ color: isAbnormal && '#f83329' }}>
            {isAbnormal ? '异常' : '正常'}
          </span>
        );
      },
    },
    {
      label: '处理结果',
      render({
        result: [
          overTime=0,
          rectifyNum=0,
          reviewNum=0,
          finish=0,
        ]=[],
      }) {
        return (
          <Fragment>
            {overTime !== 0 && (
              <div className={styles.itemResult}>
                <div className={styles.itemPoint} style={{ backgroundColor: '#f83329' }} />
                <div className={styles.itemResultLabel}>已超期</div>
                {overTime}
              </div>
            )}
            {rectifyNum !== 0 && (
              <div className={styles.itemResult}>
                <div className={styles.itemPoint} style={{ backgroundColor: '#ffb400' }} />
                <div className={styles.itemResultLabel}>待整改</div>
                {rectifyNum}
              </div>
            )}
            {reviewNum !== 0 && (
              <div className={styles.itemResult}>
                <div className={styles.itemPoint} style={{ backgroundColor: '#00a8ff' }} />
                <div className={styles.itemResultLabel}>待复查</div>
                {reviewNum}
              </div>
            )}
            {finish !== 0 && (
              <div className={styles.itemResult}>
                <div className={styles.itemPoint} style={{ backgroundColor: '#9f9f9f' }} />
                <div className={styles.itemResultLabel}>已关闭</div>
                {finish}
              </div>
            )}
            {overTime + rectifyNum + reviewNum + finish === 0 && (
              <div className={styles.itemResult}>——</div>
            )}
          </Fragment>
        );
      },
      valueContainerClassName: styles.resultValueContainer,
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
