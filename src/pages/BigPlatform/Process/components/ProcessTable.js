import React from 'react';

import styles from './ProcessBody.less';
import { WIDTH, getDirectionStyle } from '../utils';

function getValueByStatus(value, linkStatus, status) {
  if (linkStatus === 0) { // 正常
    if (status === 0)
      return value;
    return <span className={styles.warning}>{value}</span>;
  }
  return '-';
}

export default function ProcessTable(props) {
  const { showLabel, title, width, position=[0,0], params, ...restProps } = props;
  const widthPercent = width/WIDTH*100;
  const extraStyle = getDirectionStyle(position, 'leftTop');
  const titles = Array.isArray(title) ? title : [title];
  const classNameIndex = showLabel ? '' : '1';

  return (
    <table style={{ width: `${widthPercent}%`, ...extraStyle }} className={styles.table} {...restProps}>
      <thead className={styles.thead}>
        {titles.map((t, i) => (
          <tr key={i}>
            <th className={styles.thTitle} colSpan={3}>
              {t}
            </th>
        </tr>
        ))}
      </thead>
      <tbody>
        {params.map(({ id, paramDesc: label, realValue: value, paramUnit: unit, linkStatus, status }) => (
          <tr className={styles.tr} key={id}>
            <td className={styles[`tdLabel${classNameIndex}`]}>{showLabel ? label : ''}</td>
            <td className={styles[`tdValue${classNameIndex}`]}>
              {getValueByStatus(value, linkStatus, status)}
            </td>
            <td className={styles[`tdUnit${classNameIndex}`]}>{unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
