import React, { PureComponent } from 'react';
import moment from 'moment';

import styles from './Info.less';
import upIcon from '../imgs/upArrow.png';
import downIcon from '../imgs/downArrow.png';
import infoBg from '../imgs/information.png';

function InfoItem(props) {
  const { time, person, phone, desc } = props;

  return (
    <div>
      <p className={styles.time}>今日 {moment(time).format('HH:mm:ss')}</p>
      <p>【{person}】{desc}</p>
    </div>
  );
}

export default class Info extends PureComponent {
  state = { isMore: false };

  handleArrowClick = e => {
    this.setState(({ isMore }) => ({ isMore: !isMore }));
  };

  render() {
    const { data } = this.props;
    const { isMore } = this.state;

    let items = <p className={styles.empty}>暂无信息</p>;
    if (data.length)
      items = data.map(({ name, time, desc }, i) => (
        <InfoItem
          key={i}
          person={name}
          time={time}
          desc={desc}
        />
      ));

    const style = {
      // backgroundImage: `url(${infoBg})`,
      height: isMore ? '90%' : '20%',
    };

    return (
      <div className={styles.container} style={style}>
        {items}
        <span
          className={styles.arrow}
          style={{ backgroundImage: `url(${isMore ? upIcon : downIcon })` }}
          onClick={this.handleArrowClick}
        />
      </div>
    );
  }
}
