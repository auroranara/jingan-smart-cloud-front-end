import React from 'react';

import styles from './UnitInfo.less';

const NO_DATA = '暂无信息';

export default function UnitInfo(props) {
  const { name, location, clickCamera, ...restProps } = props;
  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.unit}>
        <span className={styles.unitIcon}/>
        所属单位：{name || NO_DATA}
      </p>
      <p>
        <span className={styles.locationIcon} />
        区域位置：{location || NO_DATA}
      </p>
      {clickCamera && <span className={styles.cameraIcon} />}
    </div>
  );
}
