import React from 'react';

import FcSection from '../../FireControl/section/FcSection';
import ProgressBar from '../components/ProgressBar';

export default function GasSection(props) {
  const { handleRotate, total=300 } = props;

  const sts = [{status: '正常', num: 270, percent: 270/total*100, strokeColor: 'rgb(0, 161, 129)'}];

  return (
    <FcSection title="可燃/有毒气体监测">
      {sts.map(item => <ProgressBar {...item} />)}
    </FcSection>
  );
}
