import React, { PureComponent } from 'react';
import { TreeSelect } from 'antd';

// import bg from './img/title.png';
import styles from './Head.less';
import { TREE_DATA } from './utils';

const DAY = ['天', '一', '二', '三', '四', '五', '六'];

function addZero(n) {
  return n < 10 ? `0${n}` : n;
}

export default class Head extends PureComponent {
  state = {
    time: new Date,
    treeValue: TREE_DATA[0].key,
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ time: new Date });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer = null;

  onChange = value => {
    // console.log(value);
    this.setState({ treeValue: value });
  };

  render() {
    const { title } = this.props;
    const { time, treeValue } = this.state;
    const date = `${time.getFullYear()}-${addZero(time.getMonth() + 1)}-${addZero(time.getDate())}`;
    const day = `星期${DAY[time.getDay()]}`;
    const hour = `${addZero(time.getHours())}:${addZero(time.getMinutes())}:${addZero(time.getSeconds())}`;

    return (
      <div className={styles.container}>
      {/* <div className={styles.container} style={{ backgroundImage: `url(${bg})` }}> */}
        <h1 className={styles.h}>{title}</h1>
        <p className={styles.time}>
          <span className={styles.date}>{date}</span>
          <span className={styles.day}>{day}</span>
          <span className={styles.hour}>{hour}</span>
        </p>
        <div className={styles.treeContainer}>
          <TreeSelect
            style={{ width: 300 }}
            value={treeValue}
            // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            dropdownClassName={styles.dropdown}
            treeData={TREE_DATA}
            // placeholder="Please select"
            treeDefaultExpandAll
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
