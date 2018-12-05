import React from 'react';
import { Col, Row } from 'antd';

import Section from '../Section';
// import Pie from './Pie';
import styles from './FireDevice.less';

import normal from '../imgs/normal.png';
import fine from '../imgs/fine.png';
import error from '../imgs/error.png';

export default function FireDevice(props) {
  const {
    systemScore: { list: params = [] },
  } = props;

  const handledParams = params.map(({ sysName, status }) => ({
    sysName,
    status,
  }));

  return (
    <Section title="消防设施情况">
      <div className={styles.contaniner}>
        <div className={styles.pieMain}>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={styles.onePie}>
              <Row gutter={24} style={{ margin: 0, height: '100%' }}>
                {[0, 1].map(index => {
                  let item = handledParams[2 * i + index];
                  if (item) {
                    const { sysName, status } = item;
                    return (
                      <Col key={index} style={{ height: '100%' }} span={12}>
                        {+status === 1 ? (
                          <span
                            className={styles.icon}
                            style={{
                              backgroundImage: `url(${error})`,
                            }}
                          />
                        ) : +status === 2 ? (
                          <span
                            className={styles.icon}
                            style={{
                              backgroundImage: `url(${normal})`,
                            }}
                          />
                        ) : +status === 3 ? (
                          <span
                            className={styles.icon}
                            style={{
                              backgroundImage: `url(${fine})`,
                            }}
                          />
                        ) : null}
                        <p style={{ textAlign: 'center' }}>{sysName}</p>
                      </Col>
                    );
                  } else return null;
                })}
              </Row>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
