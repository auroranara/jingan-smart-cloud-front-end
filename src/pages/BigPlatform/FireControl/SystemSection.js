import React, { PureComponent } from 'react';
import { Button, Col, Input, Row } from 'antd';

import FcSection from './FcSection';
import ProgressBar from './ProgressBar';
import styles from './SystemSection.less';

export default function SystemSection(props) {
  return (
    <FcSection title="系统接入">
      <Row>
        <Col span={12}>
          <div className={styles.left}>
            <p className={styles.unit}>接入单位<span className={styles.percent}>67%</span></p>
            <ProgressBar width="100%" height={10} progress={67} />
            <p className={styles.unitNumber}>200/300</p>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.right}>
            <p className={styles.host}>消防主机</p>
            <p className={styles.hostNumber}>90</p>
          </div>
        </Col>
      </Row>
    </FcSection>
  );
}
