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
  return (
    <FcSection style={{ padding: 0 }}>
      <div className={styles.divider}>
        <Divider><p className={styles.title}>江溪街道办事处</p></Divider>
      </div>
      <Row>
        <Col span={12}><div className={styles.unit}><OvUnit url={companyIcon} title="管辖单位" num="300" /></div></Col>
        <Col span={12}><div className={styles.unit}><OvUnit url={hostIcon} title="消防主机单位" num="200" /></div></Col>
      </Row>
      <OvFireCards />
      <OvDangerCards />
    </FcSection>
  );
}
