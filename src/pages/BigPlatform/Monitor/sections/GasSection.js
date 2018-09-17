import React from 'react';

import FcSection from '../../FireControl/section/FcSection';
import ProgressBar from '../components/ProgressBar';
import styles from './GasSection.less';
import { ALL, NORMAL, ABNORMAL, LOSS } from '../components/gasStatus';
import gasCircle from '../imgs/gasCircle.png';

function handlePercent(n=0, total=0) {
  // 分母是0，直接返回0
  if (!total)
    return 0;
  return Math.round(n / total * 100);
}

export default function GasSection(props) {
  const { handleClick, data } = props;
  const { count: total=0, normal=0, unnormal: abnormal=0, outContact: loss=0 } = data;

  const sts = [
    { status: '正常', num: normal, percent: handlePercent(normal, total), strokeColor: 'rgb(0, 161, 129)', handleClick: () => handleClick(NORMAL) },
    { status: '异常', num: abnormal, percent: handlePercent(abnormal, total), strokeColor: 'rgb(232, 103, 103)', handleClick: () => handleClick(ABNORMAL) },
    { status: '失联', num: loss, percent: handlePercent(loss, total), strokeColor: 'rgb(198, 193, 129)', handleClick: () => handleClick(LOSS) },
  ];

  return (
    <FcSection title="可燃/有毒气体监测">
      <div className={styles.container}>
        <div className={styles.circle} style={{ backgroundImage: `url(${gasCircle})` }}>
          <span className={styles.pointNum} onClick={() => handleClick(ALL)}>{total}</span>
          <span className={styles.point}>监测点</span>
        </div>
        <div className={styles.progressContainer}>
          {sts.map((item, index) => <ProgressBar key={index} {...item} />)}
        </div>
      </div>
    </FcSection>
  );
}
