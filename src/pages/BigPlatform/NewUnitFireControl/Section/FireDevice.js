import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';

import Section from '../Section';
import Pie from './Pie';
import styles from './FireDevice.less';

export default class FireDevice extends PureComponent {
  render() {
    return (
      <Section title="消防设施情况">
        <div className={styles.contaniner}>
          <div className={styles.pieMain}>
            {[0].map(i => (
              <div key={i} className={styles.onePie}>
                <Row gutter={24} style={{ margin: 0, height: '100%' }}>
                  {[0, 1, 2].map(() => {
                    return (
                      <Col style={{ height: '100%' }} span={12}>
                        <Pie />
                        <p>火灾自动报警系统</p>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))}
          </div>
        </div>
      </Section>
    );
  }
}
