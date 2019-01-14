import React from 'react';
import { Col, Row } from 'antd';

import styles from './Gauge.less';
import { ChartGauge } from '../components/Components';

export default function Gauge(props) {
  const { title, value, range, unit } = props;

  return (
    <Row style={{ width: 300 }}>
      <Col span={12}>
        <div className={styles.gauge}>
          <ChartGauge value={value} />
        </div>
      </Col>
      <Col span={12}>
        <p>{title}</p>
        <p>实时温度值:{value}{unit}</p>
        <p>参考范围值:{range}{unit}</p>
      </Col>
    </Row>
  );
}
