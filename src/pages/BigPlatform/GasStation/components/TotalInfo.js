import React from 'react';
import styles from './TotalInfo.less';

export default function TotalInfo(props) {
  const { index: active, data = [], loading = false, handleClick, ...restProps } = props;
  return (
    <div className={styles.totalInfo} {...restProps}>
      {data.map((item, index) => {
        const { color, name, value } = item;
        return (
          <div
            className={active === index ? styles.active : styles.infoItem}
            onClick={() => {
              if (loading || active === index) return null;
              handleClick(index);
            }}
            key={index}
            style={{ cursor: loading ? 'wait' : 'pointer' }}
          >
            {name}
            <span className={styles.infoNum} style={{ color }}>
              （{value}）
            </span>
          </div>
        );
      })}
    </div>
  );
}
