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

  return (
    <Section title="消防设施情况">
      <div className={styles.contaniner}>
        <div className={styles.pieMain}>
          <Row gutter={24} style={{ margin: 0 }}>
            {params.map((item, index) => {
              if (!item) return null;
              const { sysName, status } = item;
              if (!status) return null;
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

                  {status && <p style={{ textAlign: 'center' }}>{sysName}</p>}
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </Section>
  );
}
