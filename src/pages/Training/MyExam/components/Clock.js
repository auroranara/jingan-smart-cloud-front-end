import React, { PureComponent } from 'react';

import { getCounter } from '../utils';
import styles from './Clock.less';
import clockIcon from '../imgs/clock.png';

export default class Clock extends PureComponent {
  state = { count: 0 };

  // componentDidMount() {
  //   const { counting } = this.props;
  //   if (counting)
  //     this.timer = setInterval(() => {
  //       this.setState({ count: this.count++ });
  //     }, 1000);
  // }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  started = false;
  timer = null;
  count = 1;
  done = false;

  render() {
    const { counting, startTime, time: serverTime, limit } = this.props;
    const { count } = this.state;

    // 还没有开始计时且已从服务器获取考试开始时间和服务器时间
    if (!this.started && startTime && serverTime) {
      this.started  = true;
      if (counting)
        this.timer = setInterval(() => this.setState({ count: this.count++ }), 1000);
    }

    return (
      <div className={styles.container}>
        <img className={styles.img} width="23" height="24" src={clockIcon} alt="clock" />
        <span className={styles.exam}>{counting ? '正在考试': '考试用时'}</span>
        <span className={styles.time}>{getCounter(count, limit, startTime, serverTime, () => {
          if (!this.done) {
            this.done = true;
            clearInterval(this.timer);
            console.log('done');
          }
        })}</span>
      </div>
    );
  }
}
