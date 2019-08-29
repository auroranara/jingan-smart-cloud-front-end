import React from 'react';

import styles from './UnitInfo.less';

const NO_DATA = '暂无信息';

export default function UnitInfo(props) {
  const { name, deviceName, location, clickCamera, showUnit = true, ...restProps } = props;
  return (
    <div className={styles.container} {...restProps}>
      {showUnit && (
        <p className={styles.unit}>
          <span className={styles.unitIcon} />
          所属单位：
          {name || NO_DATA}
        </p>
      )}
      {deviceName && (
        <p>
          <span className={styles.unitIcon} />
          设备名称：
          {deviceName}
        </p>
      )}
      <p>
        <span className={styles.locationIcon} />
        区域位置：
        {location || NO_DATA}
      </p>
      {clickCamera && <span onClick={clickCamera} className={styles.cameraIcon} />}
    </div>
  );
}
