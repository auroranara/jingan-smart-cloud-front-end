import React, { PureComponent, Fragment } from 'react';
import { Tooltip, Carousel } from 'antd';
import { connect } from 'dva';
import { Section2 as Section } from '@/jingan-components/CustomSection';
import alarmDistributionBoxTop from './assets/alarm-distribution-box-top.png';
import alarmDistributionBoxBottom from './assets/alarm-distribution-box-bottom.png';
import lossDistributionBoxTop from './assets/loss-distribution-box-top.png';
import lossDistributionBoxBottom from './assets/loss-distribution-box-bottom.png';
import normalDistributionBoxTop from './assets/normal-distribution-box-top.png';
import normalDistributionBoxBottom from './assets/normal-distribution-box-bottom.png';
import distributionBoxIcon from './assets/distribution-box-icon.png';
import alarmIcon from './assets/alarm-icon.png';
import styles from './index.less';

/* 电气火灾监测 */
@connect(({ gasStation, loading }) => ({
  gasStation,
  loading,
}))
export default class ElectricalFireMonitoring extends PureComponent {
  handleItemClick = (e) => {
    const { onMultipleClick } = this.props;
    const label = e.currentTarget.getAttribute('data-label');
    onMultipleClick && onMultipleClick(label);
  }

  handleClick = (e) => {
    const { onSingleClick } = this.props;
    const id = e.currentTarget.getAttribute('data-id');
    onSingleClick && onSingleClick(id);
  }

  render() {
    const {
      distributionBoxClassification: {
        alarm=[0,0,0,0,0,0],
        loss=[0,0,0,0,0,0],
        normal=[0,0,0,0,0,0],
      }={}, // 配电箱分类
    } = this.props;
    const length = (alarm || []).length + (loss || []).length + (normal || []).length;
    let content;
    if (length === 1) {
      content = (
        <div className={styles.singleContainer}>
          <div className={styles.titleWrapper}>
            <img className={styles.titleIcon} src={distributionBoxIcon} alt="配电箱图标" />
            <span className={styles.title}>{'配电箱名称'}</span>
          </div>
        </div>
      );
    } else if (length > 1) {
      const list = [
        {
          label: '报警',
          count: alarm.length,
          top: alarmDistributionBoxTop,
          bottom: alarmDistributionBoxBottom,
          color: 'rgb(248, 51, 41)',
        },
        {
          label: '失联',
          count: loss.length,
          top: lossDistributionBoxTop,
          bottom: lossDistributionBoxBottom,
          color: 'rgb(159, 159, 159)',
        },
        {
          label: '正常',
          count: normal.length,
          top: normalDistributionBoxTop,
          bottom: normalDistributionBoxBottom,
          color: 'rgb(0, 255, 255)',
        },
      ];
      content = (
        <div className={styles.list}>
          {list.map(({ top, bottom, color, count, label }) => (
            <div className={styles.itemWrapper}>
              <Tooltip
                title={
                  <Fragment>
                    <div>配电箱的数量</div>
                    <div>{label} {count}个 ({Math.round(count / length * 100)}%)</div>
                  </Fragment>
                }
              >
                <div className={styles.item} data-label={label} onClick={this.handleItemClick}>
                  <div className={styles.itemTop}>
                    <img src={top} alt="" />
                  </div>
                  <div className={styles.itemBottom}>
                    <div className={styles.itemPercent} style={{ top: `${(1 - count / length) * 100}%`, backgroundImage: `linear-gradient(to top, ${color} 1%, rgb(3,46,100) 100%)` }} />
                    <img src={bottom} alt="" />
                    <div className={styles.itemCount}>{count}</div>
                  </div>
                  <div className={styles.itemLabel}>{label}</div>
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      );
    }

    return (
      <Section
        title="电气火灾监测"
        className={styles.container}
      >
        <div className={styles.wrapper}>
          {content}
        </div>
      </Section>
    );
  }
}
