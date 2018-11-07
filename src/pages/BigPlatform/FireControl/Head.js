import React, { PureComponent } from 'react';
import router from 'umi/router';
import { TreeSelect } from 'antd';

// import bg from './img/title.png';
import styles from './Head.less';
// import { TREE_DATA } from './utils';

const DAY = ['天', '一', '二', '三', '四', '五', '六'];

function addZero(n) {
  return n < 10 ? `0${n}` : n;
}

export default class Head extends PureComponent {
  state = {
    time: new Date,
    // treeValue: TREE_DATA[0].key,
    treeValue: '',
  };

  componentDidMount() {
    const { dispatch, gridId } = this.props;
    const isIndex = gridId === 'index';

    this.timer = setInterval(() => {
      this.setState({ time: new Date });
    }, 1000);

    // 是首页则获取网格点数组后取抵押给，不是首页则将值设为传入的gridId
    !isIndex && this.setState({ treeValue: gridId });

    dispatch({
      type: 'bigFireControl/fetchGrids',
      callback: isIndex ? data => this.setState({ treeValue: data && data.length ? data[0].key : '' }) : null,
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer = null;

  onChange = value => {
    // console.log(value);
    const { treeValue: formerValue } = this.state;

    // 选择的值与之前相同时，不做处理
    if (value === formerValue)
      return;

    this.setState({ treeValue: value });
    router.push(`/big-platform/fire-control/government/${value}`);
    location.reload();
  };

  render() {
    const { title, data } = this.props;
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
            // treeData={TREE_DATA}
            treeData={data}
            treeDefaultExpandAll
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
