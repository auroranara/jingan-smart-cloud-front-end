import React, { PureComponent, Fragment } from 'react';
import Section from '../components/Section/Section.js';
import Switcher, { Pagination } from '../components/Switcher/Switcher';
import moment from 'moment';
import iconPeople from '@/assets/inspection-people.png'; // 巡查人数
import iconTotal from '@/assets/inspection-total.png';  // 巡查总次数
import iconAverage from '@/assets/inspection-average.png';  // 人均巡查次数
import iconRate from '@/assets/inspection-rate.png';  // 巡查正常率


import styles from './InspectionStatistics.less';

const switcherInfo = [
  { label: '今日', value: 1 },
  { label: '本周', value: 2 },
  { label: '本月', value: 3 },
  { label: '本季度', value: 4 },
]

// 巡查统计
export default class InspectionStatistics extends PureComponent {

  /**
   * 渲染右侧时间选择
   */
  renderSwitchers() {
    const { type, onSwitch } = this.props;

    const pageSize = 4;
    // 页数
    // 是否为第一页
    // 当前页的第一个元素
    const currentFirstIndex = 0;

    return (
      <div className={styles.inspectionSwitcher}>
        {switcherInfo.map(({ label, value }, index) => {
          const isSelected = type === value;
          return (
            <Switcher
              style={{ top: (index - currentFirstIndex) * 56, zIndex: isSelected ? (pageSize + 1) : (pageSize + currentFirstIndex - index) }}
              isSelected={isSelected}
              content={label} key={value}
              onClick={() => { onSwitch(value); }} />
          );
        })}
      </div>
    );
  }

  render() {
    const {
      abnormal = 0,
      normal = 0,
      personNum = 0,
      totalCheckNum = 0,
      onClick,
    } = this.props
    const style = {
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    }
    const total = abnormal + normal
    const normalRate = total ? (normal / total).toFixed(2) * 100 : 0
    const abnormalRate = total ? (abnormal / total).toFixed(2) * 100 : 0
    return (
      <Section title="巡查统计" fixedContent={(
        <Fragment>
          <div className={styles.inspectionStatics}>
            <div><div style={{ background: `url(${iconPeople})`, ...style }}></div><span>巡查人数：{personNum}</span></div>
            <div><div style={{ background: `url(${iconTotal})`, ...style }}></div><span>巡查总次数：{totalCheckNum}</span></div>
            <div><div style={{ background: `url(${iconAverage})`, ...style }}></div><span>人均巡查次数：{personNum ? Math.floor(totalCheckNum / personNum) : 0}</span></div>
            <div><div style={{ background: `url(${iconRate})`, ...style }}></div><span>巡查正常率：{normalRate}%</span></div>
          </div>
          {this.renderSwitchers()}
        </Fragment>
      )}
      >
        <div className={styles.inspectionContainer}>
          <div className={styles.statusItem} onClick={() => onClick('normal')}>
            <div className={styles.statistic}>
              <div className={styles.title}><span>正常</span></div>
              <span className={styles.number} style={{ color: '#00ABCA' }}>{normal}</span>
            </div>
            <div className={styles.barItem}>
              <div className={styles.barContainer}>
                <div className={styles.bar} style={{ width: `${normalRate}%`, background: '#00ABCA' }}></div>
              </div>
            </div>
          </div>
          <div className={styles.statusItem} onClick={() => onClick('abnormal')}>
            <div className={styles.statistic}>
              <div className={styles.title}><span>异常</span></div>
              <span className={styles.number} style={{ color: '#E86766' }}>{abnormal}</span>
            </div>
            <div className={styles.barItem}>
              <div className={styles.barContainer}>
                <div className={styles.bar} style={{ width: `${abnormalRate}%`, background: '#E86766' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    )
  }
}
