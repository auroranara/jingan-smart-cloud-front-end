import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Section from '@/components/NewSection';
// 引入样式文件
import styles from './index.less';

/**
 * 火警数量统计
 */
@connect(({ operation }) => ({
  count: operation.fireCount,
}))
export default class FireCount extends PureComponent {
  componentDidMount() {
    this.getFireCount();
  }

  getFireCount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'operation/fetchFireCount',
      payload: {

      },
    });
  }

  handleClick = (e) => {
    const { onClick } = this.props;
    const type = e.currentTarget.getAttribute('data-type');
    onClick && onClick(type);
  }

  render() {
    const {
      count: {
        day=0,
        week=0,
        month=0,
      }={},
    } = this.props;
    const list = [
      {
        label: '今日',
        value: day,
        borderColor: '#00ffff',
      },
      {
        label: '本周',
        value: week,
        borderColor: '#00ffff',
      },
      {
        label: '本月',
        value: month,
        borderColor: '#00ffff',
      },
    ];

    return (
      <Section
        className={styles.container}
        title="火警数量统计"
        contentStyle={{ padding: 0 }}
      >
        <div className={styles.list}>
          {list.map(({ label, value, borderColor }) => (
            <div key={label} className={styles.item} data-type={label} onClick={this.handleClick}>
              <div style={{ borderColor }}><span>{value}</span></div>
              <div>{label}</div>
            </div>
          ))}
        </div>
      </Section>
    );
  }
}
