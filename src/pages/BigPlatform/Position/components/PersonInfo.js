import React, { PureComponent } from 'react';
import { Button, Icon, message } from 'antd';

import styles from './PersonInfo.less';
import { getUserName } from '../utils';

const NO_DATA = '暂无信息';

function getStatusElem(isAlarmExceptSOS, isSOS, isOff, SOSItem, alarmExceptSOSItem) {
  let elem = null;
  let disabled = false;
  let alarmId = undefined;
  let handleSOS = false;
  // 最高优先级，sos状态且sos报警还有未处理的
  if (isSOS && SOSItem) {
    handleSOS = true;
    alarmId = SOSItem.id;
    elem = <span className={styles.sos} />;
  }
  // 次优先，普通报警状态且普通报警还有未处理的
  else if (isAlarmExceptSOS && alarmExceptSOSItem) {
    alarmId = alarmExceptSOSItem.id;
    elem = <span className={styles.alarm}>[报警]</span>;
  }
  // 第三优先级，sos状态但sos报警都已处理
  else if (isSOS && !SOSItem) {
    handleSOS = true;
    elem = <span className={styles.sos} />;
  }
  // 上述三个优先级都可以处理报警，下面一个不需要处理
  // 第四优先级，普通报警状态存在但报警都已处理
  else if (isAlarmExceptSOS && !alarmExceptSOSItem) {
    disabled = true;
    elem = <span className={styles.alarm}>[报警]</span>;
  }
  // 上面的都是有报警的状态，会显示处理报警按钮，下面的离线和在线状态不显示报警处理按钮，所以不需要对disable赋值
  // 第五优先级，离线状态
  else if (isOff)
    elem = <span className={styles.offline}>[离线]</span>;
  // 最低优先级，在线状态
  else
    elem = <span className={styles.online}>[在线]</span>;


  return { elem, disabled, alarmId, handleSOS };
}

export default class PersonInfo extends PureComponent {
  onClose = e => {
    const { handleClose } = this.props;
    handleClose('personInfo');
  };

  // handleAlarmClick = e => {
  //   const {
  //     alarms,
  //     personItem: { cardId },
  //     handleShowAlarmHandle,
  //   } = this.props;

  //   // 根据cardId在alarms列表中寻找对应的sos报警信息
  //   const alarmItem = alarms.find(({ cardId: id, type }) => id === cardId && +type === 1);
  //   const alarmId = alarmItem ? alarmItem.id : undefined;
  //   handleShowAlarmHandle(alarmId, cardId);
  // };

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

    const { cardId, sos: isSOS, tlong, overstep, cardType, phoneNumber, visitorPhone, cardCode, areaId, departmentName, onlineStatus } = personItem;
    const isAlarmExceptSOS = tlong || overstep;
    const isVisitor = !!+cardType;
    const isOff = !+onlineStatus;
    const name = getUserName(personItem);
    const phone = isVisitor ? visitorPhone : phoneNumber;
    const areaName = areaInfo[areaId] ? areaInfo[areaId].fullName : NO_DATA;
    const sortAlarms = [...alarms];
    sortAlarms.sort((a1, a2) => a2.warningTime - a1.warningTime);
    const SOSItem = sortAlarms.find(({ cardId: id, type }) => id === cardId && +type === 1);
    const alarmExceptSOSItem = sortAlarms.find(({ cardId: id, type }) => id === cardId && +type !== 1);
    const { elem, disabled, alarmId, handleSOS } = getStatusElem(isAlarmExceptSOS, isSOS, isOff, SOSItem, alarmExceptSOSItem);
    const handleAlarmClick = e => {
      handleShowAlarmHandle(alarmId, cardId, handleSOS);
    };

    const newStyle = {
      // paddingBottom: isSOS ? 70 : 15,
      ...style,
      display: visible ? 'block' : 'none',
    };

    return (
      <div className={styles.container} style={newStyle} {...restProps}>
        <Icon type="close" className={styles.close} onClick={this.onClose} />
        <div className={styles.info}>
          <div className={styles[`${isVisitor ? 'visitorAvatar' : 'avatar'}${isOff ? 'Off' : ''}`]} />
          <h3 className={styles.name}>
            {name}
            {elem}
          </h3>
          <p>电话：{phone || NO_DATA}</p>
          <p>卡号：{cardCode || NO_DATA}</p>
          {!isVisitor && <p>部门：{departmentName || NO_DATA}</p>}
          <p>区域：{areaName}</p>
        </div>
        <div className={styles.btns}>
          {(isSOS || isAlarmExceptSOS) && (
            <Button
              ghost
              disabled={disabled}
              className={styles.btn}
              onClick={handleAlarmClick}
            >
              {disabled ? '已' : ''}处理
            </Button>
          )}
          <Button ghost className={styles.btn} onClick={this.handleTrackClick}>目标追踪</Button>
        </div>
      </div>
    );
  }
}
