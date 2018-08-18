import React, { PureComponent } from 'react';
import { Col, Divider, Row } from 'antd';

import FcSection from './FcSection';
import OvUnit from './OvUnit';
import OvFireCards from './OvFireCards';
import OvDangerCards from './OvDangerCards';
import styles from './OverviewSection.less';
import companyIcon from './ovCompany.png';
import hostIcon from './ovHost.png';

export default function OverviewSection(props) {
  const { total=0, activeCount=0, todayCount=0, thisWeekCount=0, thisMonthCount=0, totalDanger=0, overdueNum=0, rectifyNum=0, reviewNum=0 } = props.ovData;

  return (
    <FcSection style={{ padding: '20px 2px 0' }}>
      <div className={styles.divider}>
        <Divider><p className={styles.title}>江溪街道办事处</p></Divider>
      </div>
      <Row style={{ marginTop: 10 }}>
        <Col span={12}><div className={styles.unit}><OvUnit url={companyIcon} title="管辖单位" num={total} /></div></Col>
        <Col span={12}><div className={styles.unit}><OvUnit url={hostIcon} title="消防主机单位" num={activeCount} /></div></Col>
      </Row>
      <OvFireCards todayCount={todayCount} thisWeekCount={thisWeekCount} thisMonthCount={thisMonthCount} />
      <OvDangerCards total={totalDanger} overdue={overdueNum} rectify={rectifyNum} review={reviewNum} />
    </FcSection>
  );
}
