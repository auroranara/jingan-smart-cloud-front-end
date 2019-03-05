import React from 'react';
import moment from 'moment';
import { Button, Icon } from 'antd';

import styles from './AlarmMsg.less';
import { getAlarmDesc } from '../utils';

export default function AlarmMsg(props) {
  const {
    visible,
    style,
    areaInfo,
    data={},
    handleShowAlarmHandle,
    handleClose,
    ...restProps
  } = props;
  const { id, areaId, typeName, warningTime } = data;
  const [title, desc] = getAlarmDesc(data, areaInfo);
  const areaName = areaInfo[areaId] ? areaInfo[areaId].fullName : '暂无信息';

  const newStyle = {
    ...style,
    display: visible ? 'block' : 'none',
  };

  return (
    <div className={styles.container} style={newStyle} {...restProps}>
      <Icon type="close" className={styles.close} onClick={e => handleClose('alarmMsg')} />
      <Button ghost className={styles.btn} onClick={e => handleShowAlarmHandle(id)}>处理</Button>
      <h5 className={styles.title}>
        <span className={styles.info} />
        报警信息
      </h5>
      <p>区域名称：{areaName}</p>
      <p>报警类型：{typeName}</p>
      <p>报警时间：{moment(warningTime).format('YYYY-MM-DD HH:mm:ss')}</p>
      <p>报警内容：{desc}</p>
    </div>
  );
}
