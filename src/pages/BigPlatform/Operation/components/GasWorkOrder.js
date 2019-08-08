import React, { Fragment } from 'react';

import { AlarmCount, DrawerSection, GasFlow } from './Components';

export default function GasWorkOrder(props) {
  const { data } = props;
  const extra = null;
  return (
    <Fragment>
      <DrawerSection
        title="工单处理流程"
        style={{ padding: 0 }}
      >
        <GasFlow data={data} />
      </DrawerSection>
      <DrawerSection
        title="问题统计"
        style={{ padding: '10px 0 0 0', borderTop: '1px solid rgb(76, 206, 240)' }}
        extra={extra}
      >
        <AlarmCount />
      </DrawerSection>
    </Fragment>
  );
}
