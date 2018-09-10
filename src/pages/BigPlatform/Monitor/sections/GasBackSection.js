import React from 'react';

import FcSection from '../../FireControl/section/FcSection';
import backIcon from '../../FireControl/img/back.png';
import styles from './GasBackSection.less';

export default function GasSection(props) {
  const { handleRotate } = props;

  return (
    <FcSection title="可燃/有毒气体监测" style={{ position: 'relative' }} isBack>
      <span
        className={styles.back}
        onClick={handleRotate}
        style={{ backgroundImage: `url(${backIcon})` }}
      />
    </FcSection>
  );
}
