import React from 'react';
import { Button } from 'antd';

import styles from './AlarmMsg.less';
import bg from '../imgs/alarmCard.png';
import infoIcon from '../imgs/alarmInfo.png';

const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)', position: 'absolute', left: '50%', bottom: 25, transform: 'translateX(-50%)' };

export default function AlarmMsg(props) {
  const { section, type, time } = props;

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bg})`}}>
      <Button ghost style={BTN_STYLE}>处理</Button>
      <h5 className={styles.title}>
        <span className={styles.info} style={{ backgroundImage: `url(${infoIcon})` }} />
        报警信息
      </h5>
      <p>区域名称：五号楼3层实验室</p>
      <p>报警类型：越界</p>
      <p>报警时间：2018-12-22 10:30:00</p>
    </div>
  );
}
