import React, { PureComponent } from 'react';
import { Button, Icon, message } from 'antd';

import styles from './PersonInfo.less';
import { getUserName } from '../utils';

const NO_DATA = '暂无信息';

export default class PersonInfo extends PureComponent {
  onClose = e => {
    const { handleClose } = this.props;
    handleClose('personInfo');
  };

  handleAlarmClick = e => {
    const {
      alarms,
      personItem: { cardId },
      handleShowAlarmHandle,
    } = this.props;

    // 根据cardId在alarms列表中寻找对应的sos报警信息
    const alarmItem = alarms.find(({ cardId: id, type }) => id === cardId && +type === 1);
    const alarmId = alarmItem ? alarmItem.id : undefined;
    handleShowAlarmHandle(alarmId, cardId);
  };

  handleTrackClick = e => {
    const { personItem: { areaId, cardId }, handleTrack } = this.props;
    handleTrack(areaId, cardId);
    this.onClose();
  };

  render() {
    const {
      visible,
      companyId,
      areaInfo,
      alarms,
      personItem,
      style,
      handleTrack,
      handleShowAlarmHandle,
      handleClose,
      ...restProps
    } = this.props;

    const { sos: isSOS, cardType, phoneNumber, visitorPhone, cardCode, areaId, departmentName } = personItem;
    const isVisitor = !!+cardType;
    const name = getUserName(personItem);
    const phone = isVisitor ? visitorPhone : phoneNumber;
    const areaName = areaInfo[areaId] ? areaInfo[areaId].fullName : NO_DATA;

    const newStyle = {
      // paddingBottom: isSOS ? 70 : 15,
      ...style,
      display: visible ? 'block' : 'none',
    };

    return (
      <div className={styles.container} style={newStyle} {...restProps}>
        <Icon type="close" className={styles.close} onClick={this.onClose} />
        <div className={styles.info}>
          <div className={styles[isVisitor ? 'visitorAvatar' : 'avatar']} />
          <h3 className={styles.name}>
            {name}
            {isSOS && <span className={styles.sos} />}
          </h3>
          <p>电话：{phone || NO_DATA}</p>
          <p>卡号：{cardCode || NO_DATA}</p>
          {!isVisitor && <p>部门：{departmentName || NO_DATA}</p>}
          <p>区域：{areaName}</p>
        </div>
        <div className={styles.btns}>
          {isSOS && <Button ghost className={styles.btn} onClick={this.handleAlarmClick}>处理</Button>}
          <Button ghost className={styles.btn} onClick={this.handleTrackClick}>目标追踪</Button>
        </div>
      </div>
    );
  }
}
