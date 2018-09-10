import React from 'react';
import { Row, Col } from 'antd';

import styles from './ExhaustMonitor.less';
import ExhaustCards from './ExhaustCards';
import FcSection from '../FireControl/section/FcSection';

export default function ExhaustMonitor() {
  // const {
  //   data: { list = [] },
  // } = this.props;

  const cards = (
    <Row gutter={16} style={{ margin: 0, height: '100%' }}>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards title="SO" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards title="NOX" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards title="颗粒物" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards title="流速" />
      </Col>
    </Row>
  );

  const noCards = <div className={styles.noCards} />;

  return (
    <FcSection title="废气监测">
      <Row>
        <Col span={2}>
          <span>pic</span>
        </Col>
        <Col span={4}>
          <span>2018-08-17</span>
        </Col>
        <Col span={18}>
          <span>15:00</span>
        </Col>
      </Row>
      <div className={styles.mainCards}>{cards}</div>;
    </FcSection>
  );
}
