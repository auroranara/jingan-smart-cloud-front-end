import React, { PureComponent } from 'react';
import { Button } from 'antd';

import styles from './CardSelected.less';
import { getUserName } from '../utils';

const rect = <span className={styles.rect} />;

export default class CardSelected extends PureComponent {
  handleQuitTrack = e => {
    const { setSelectedCard } = this.props;
    setSelectedCard();
  };

  render() {
    const { areaInfo, cardId, positions } = this.props;
    const card = positions.find(({ cardId: id }) => id === cardId) || {};
    const { areaId, cardType, phoneNumber, visitorPhone, cardCode, departmentName } = card;
    const isVisitor = !!+cardType;
    const name = getUserName(card);
    const phone = isVisitor ? visitorPhone : phoneNumber;

    return (
      <div className={styles.container}>
        <div className={styles.up}>
          <h3 className={styles.title}>
            {rect}
            人员信息
          </h3>
          <div className={styles.info}>
            <div className={styles[isVisitor ? 'visitorAvatar' : 'avatar']} />
            <p className={styles.name}>{name}</p>
            <p>电话：{phone}</p>
            <p>编号：{cardCode}</p>
            {departmentName && <p>部门：{departmentName}</p>}
            <p>区域：{areaInfo[areaId].fullName}</p>
          </div>
          <div className={styles.btns}>
            <Button ghost className={styles.btn}>历史轨迹</Button>
            <Button ghost className={styles.btn} onClick={this.handleQuitTrack}>取消追踪</Button>
          </div>
        </div>
        <div className={styles.down}>
          <h3 className={styles.title}>
            {rect}
            视频监控
          </h3>
        </div>
      </div>
    )
  }
}
