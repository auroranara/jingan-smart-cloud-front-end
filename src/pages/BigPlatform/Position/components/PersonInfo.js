import React from 'react';
import { Button } from 'antd';

import styles from './PersonInfo.less';
import bg from '../imgs/personCard.png';
import Zhang from '../imgs/zhang.png';
import sosIcon from '../imgs/sos.png';

const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)', position: 'absolute', left: '50%', bottom: 25, transform: 'translateX(-50%)' };

export default function PersonInfo(props) {
  const { isSOS, name, phone, code, department, section } = props;

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bg})`, paddingBottom: isSOS ? 70 : 15 }}>
      <div className={styles.img} style={{ backgroundImage: `url(${Zhang})` }} />
      {isSOS && <Button ghost style={BTN_STYLE}>处理</Button>}
      <h3 className={styles.name}>
        {name}
        {isSOS && <span className={styles.sos} style={{ backgroundImage: `url(${sosIcon})` }} />}
      </h3>
      <p>电话：{phone}</p>
      <p>编号：{code}</p>
      <p>部门：{department}</p>
      <p>区域：{section}</p>
    </div>
  );
}
