import React from 'react';

import styles from './ProcessBody.less';
import { WIDTH, getDirectionStyle } from '../utils';

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
        {params.map(({ name, label, value, unit }) => (
          <tr className={styles.tr} key={name}>
            <td className={styles[`tdLabel${classNameIndex}`]}>{showLabel ? label : ''}</td>
            <td className={styles[`tdValue${classNameIndex}`]}>{value}</td>
            <td className={styles[`tdUnit${classNameIndex}`]}>{unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
