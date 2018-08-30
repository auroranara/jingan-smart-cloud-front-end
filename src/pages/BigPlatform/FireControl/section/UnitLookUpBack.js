import React from 'react';

import FcSection from './FcSection';
import LookingUp from '../components/LookingUp';
import OffGuardWarning from '../components/OffGuardWarning';
import styles from './UnitLookUpBack.less';

const LOOKING_UP = 'lookingUp';
const OFF_GUARD = 'offGuardWarning';

const titleMap = {
  [LOOKING_UP]: '单位查岗',
  [OFF_GUARD]: '脱岗警告',
};

export default function(props) {
  const { lookUpShow, handleRotateBack, startLookUp, data: { offGuard } } = props;
  return (
    <FcSection title={titleMap[lookUpShow]} style={{ position: 'relative' }} isBack>
      <LookingUp
        showed={lookUpShow === LOOKING_UP}
        startLookUp={startLookUp}
        handleRotateBack={handleRotateBack}
      />
      <OffGuardWarning showed={lookUpShow === OFF_GUARD} data={offGuard} />
      {lookUpShow === OFF_GUARD ? (
        <span onClick={handleRotateBack} className={styles.offGuardBackIcon} />
      ) : null}
    </FcSection>
  );
}
