import React, { PureComponent } from 'react';

import { getCounter } from '../utils';
import styles from './Clock.less';
import clockIcon from '../imgs/clock.png';

export default class Clock extends PureComponent {
  state = { count: 0 };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidUpdate(prevProps, prevState) {
    const { restTime: prevRestTime } = prevProps;
    const { counting, restTime } = this.props;

    // console.log(restTime);
    if (!counting)
      return;

    // restTime变化时，重新开始计时
    if (prevRestTime !== restTime) {
      clearInterval(this.timer);
      this.setState({ count: 0 });
      this.timer = setInterval(() => {
        this.setState(({ count }) => ({ count: count + 1 }));
      }, 1000);
    }
  }

  timer = null;

  render() {
    const { counting, restTime, handleStop } = this.props;
    const { count } = this.state;

    // console.log(count);

    return (
      <div className={styles.container}>
        <img className={styles.img} width="23" height="24" src={clockIcon} alt="clock" />
        <span className={styles.exam}>{counting ? '剩余时间': '考试用时'}</span>
        <span className={styles.time}>{counting ? getCounter(restTime - count * 1000, () => {
          clearInterval(this.timer);
          // console.log('done');
          handleStop();
        }) : getCounter(restTime)}</span>
      </div>
    );
  }
}
