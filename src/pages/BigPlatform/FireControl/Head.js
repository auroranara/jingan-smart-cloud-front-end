import React, { PureComponent } from 'react';

import bg from './title.png';
import styles from './Head.less';

const DAY = ['天', '一', '二', '三', '四', '五', '六'];

function addZero(n) {
  return n < 10 ? `0${n}` : n;
}

export default class Head extends PureComponent {
  state = { time: new Date };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ time: new Date });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer = null;

  render() {
    const { title } = this.props;
    const { time } = this.state;
    const date = `${time.getFullYear()}-${addZero(time.getMonth() + 1)}-${addZero(time.getDate())}`;
    const day = `星期${DAY[time.getDay()]}`;
    const hour = `${addZero(time.getHours())}:${addZero(time.getMinutes())}:${addZero(time.getSeconds())}`;

    return (
      <div className={styles.container} style={{ background: `url(${bg})`, backgroundSize: '80% 100%', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
        <h1 className={styles.h}>{title}</h1>
        <p className={styles.time}>
          <span className={styles.date}>{date}</span>
          <span className={styles.day}>{day}</span>
          <span className={styles.hour}>{hour}</span>
        </p>
      </div>
    );
  }
}
