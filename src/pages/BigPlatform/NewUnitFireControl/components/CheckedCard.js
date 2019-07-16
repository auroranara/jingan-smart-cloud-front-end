import React, { Fragment } from 'react';
import moment from 'moment';
import BigPlatformCard from '@/jingan-components/BigPlatformCard';
import { DotItem } from '../../ElectricityMonitor/components/Components';
// 引入样式文件
import styles from './CheckedCard.less';
const { Container } = BigPlatformCard;

// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';
// 巡查来源
const SOURCE = ['企业自查', '政府监管', '维保检查'];

const NO_DATA = '暂无数据';

export default class CheckedCard extends BigPlatformCard {
  FIELDNAMES = {
    id: 'id', // 主键
    checkDate: 'checkDate', // 巡查日期
    source: 'source', // 巡查来源
    checkusers: 'checkusers', // 巡查人员
    status: 'status', // 巡查状态
    overTimeId: 'overTimeId', // 已超时
    rectifyId: 'rectifyId', // 未超时
    reviewId: 'reviewId', // 待复查
    finishId: 'finishId', // 已关闭
    hiddenDanger: 'hiddenDanger', // 隐患情况
    hiddenDangerClick: 'hiddenDangerClick', // 点击隐患数量
  };

  FIELDS = [
    {
      label: '巡查日期',
      render: ({ checkDate }) => (checkDate && moment(+checkDate).format(TIME_FORMAT)) || NO_DATA,
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '巡查来源',
      render: ({ source }) => (source ? SOURCE[source - 1] : NO_DATA),
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '巡查人员',
      key: 'checkusers',
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '巡查状态',
      render: ({ status }) => (+status === 1 ? '正常' : <span className={styles.red}>异常</span>),
      labelContainerClassName: styles.labelContainer,
    },
    {
      label: '隐患情况',
      key: 'hiddenDanger',
      render: ({ overTimeId, rectifyId, reviewId, finishId, hiddenDangerClick }) => {
        const total = overTimeId.length + rectifyId.length + reviewId.length + finishId.length;
        const hiddenDangers = [
          { label: '已超时', color: '#F83329', value: overTimeId.length, ids: overTimeId },
          { label: '未超时', color: '#FFB400', value: rectifyId.length, ids: rectifyId },
          { label: '待复查', color: '#2A8BD5', value: reviewId.length, ids: reviewId },
          { label: '已关闭', color: '#9F9F9F', value: finishId.length, ids: finishId },
        ];
        return total > 0 ? (
          <Fragment>
            <span className={styles.red} style={{ display: 'inline-block', marginRight: '10px' }}>
              {total}条
            </span>
            {hiddenDangers.map(item => {
              const { label, color, value, ids } = item;
              return value > 0 ? (
                <DotItem
                  title={label}
                  color={color}
                  quantity={value}
                  className={styles.label}
                  key={label}
                  onClick={() => hiddenDangerClick(ids)}
                />
              ) : null;
            })}
            {/* {overTimeId > 0 && (
              <DotItem
                title="已超时"
                color={`#F83329`}
                quantity={overTimeId}
                className={styles.label}
              />
            )}
            {rectifyId > 0 && (
              <DotItem
                title="未超时"
                color={`#FFB400`}
                quantity={rectifyId}
                className={styles.label}
              />
            )}
            {reviewId > 0 && (
              <DotItem
                title="待复查"
                color={`#2A8BD5`}
                quantity={reviewId}
                className={styles.label}
              />
            )}
            {finishId > 0 && (
              <DotItem
                title="已关闭"
                color={`#9F9F9F`}
                quantity={finishId}
                className={styles.label}
              />
            )} */}
          </Fragment>
        ) : (
          `无`
        );
      },
      labelContainerClassName: styles.labelContainer,
    },
  ];

  handleClick = () => {
    const { onClick, data } = this.props;
    onClick && onClick(data);
  };

  render() {
    const {
      className, // 容器类名
      style = {}, // 容器样式
      onClick,
    } = this.props;
    const fieldsValue = this.getFieldsValue();

    return (
      <Container
        className={className}
        style={{
          paddingTop: '0.5em',
          paddingBottom: '0.5em',
          ...style,
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        {this.renderFields(fieldsValue)}
      </Container>
    );
  }
}
