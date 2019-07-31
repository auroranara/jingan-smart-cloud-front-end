import React from 'react';

import GasCircle from './GasCircle';
import styles from './GasCard.less';

const NO_DATA = '暂无信息';
const COLORS = ['rgb(0, 161, 129)', 'rgb(232, 103, 103)', 'rgb(198, 193, 129)'];

// const pms = [
//   { id: 0, desc: 'LEL', unit: '%', value: 10 },
//   { id: 1, desc: 'CUR', unit: 'A', value: 2 },
//   { id: 2, desc: 'MAG', unit: 'T', value: 0.2 },
// ];

const statusList = {
  '-20': '关闭',
  '-21': '打开',
  '-22': '未连接',
  '-23': '正在打开',
  '-24': '正在关闭',
  '-25': '故障',
}



export default function GasCard(props) {
  const { status = 0, location, time, params, style = {}, armStatus, ...restProps } = props;
  const color = COLORS[status];
  const newStyle = {
    borderLeft: `4px solid ${color}`,
    ...style,
  };

  return (
    <div className={styles.card} style={newStyle} {...restProps}>
      <p className={styles.location}>{location ? location : NO_DATA}</p>
      {armStatus && (<div className={styles.line}>机械臂状态：{statusList[armStatus]}</div>)}
      <p className={styles.time} style={armStatus ? { marginTop: '14px' } : null}>
        {time ? time : NO_DATA}
      </p>
      <div className={styles.circleContainer}>
        {params.map(({ id, desc, unit, value, code = null }) => {
          return code === '_arm_status' ? null : (
            <GasCircle
              key={id}
              color={color}
              desc={desc}
              unit={unit}
              val={value}
              style={{ marginLeft: 5 }}
            />
          )
        })}
        {/* {pms.map(({ id, desc, unit, value }) => <GasCircle key={id} color={color} desc={desc} unit={unit} val={value} style={{ marginLeft: 5 }} />)} */}
      </div>
    </div>
  );
}
